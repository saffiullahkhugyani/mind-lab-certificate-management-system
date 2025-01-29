"use server"

import { createClient } from "@/lib/supabase/server"
import { DonationAllocation, Programs } from "@/types/types";


export async function clubsList() {
  const supabase = createClient();

  try {
    const { data: clubs, error: fetchError } = await supabase
      .from("clubs")
      .select()
      .order("created_at", { ascending: true });
  
    
    if (fetchError) {
      throw new Error("Failed to fetch clubs. Please try again later.");
    }

    return {success: true, data: clubs}
    
  } catch (error: any) {
    // Handle and return the error to be displayed as a toast
    console.error("Error in fetchinng clubs", error.message);
    return { success: false, error: error.message };
  }
  
}

export async function addProgram(programData: Programs) {
  const supabase = createClient();

  try { 

    const { data: existingProgram, error: existingProgramError } = await supabase
      .from("programs")
      .select("*")
      .eq("program_english_name", programData.program_english_name!.trim());
    
      if (existingProgramError) {
        // console.log("Existing Program Error: ", existingProgramError);      
        throw new Error(existingProgramError.message);
    }
    
    if (existingProgram.length > 0) {
      console.log("Existing: ", existingProgram);
      throw new Error("Program already exists");
    }
      
    const { data, error } = await supabase.from("programs")
        .insert(programData).select()
    
    if (data != null) {
      return {success: true, message: data}
    }
    
    if (error) {
      throw new Error(error.message);
    }
    
      
  } catch (error: any) {
    // Handle and return the error to be displayed as a toast
    console.error("Error in adding a program: ", error.message);
    return { success: false, error: error.message };
  }
  
}

export async function programsList() {
  const supabase = createClient();
  const { data, error } = await supabase.from("programs")
    .select().order("program_english_name", { ascending: true });
    
    if (data != null)
  {

    console.log("programs list: ",data);
  } else {
    console.log("Error fetching programs list: ",error)
  }

  return data;
  
}

export async function donationAllocation(formData: DonationAllocation) {
  const supabase = createClient();

  try {
    // Step 1: Fetch available donations ordered by creation time (FIFO)
    const { data: donations, error: fetchError } = await supabase
      .from("donation")
      .select("donation_id, remaining_amount, created_at")
      .gte("remaining_amount", 0)
      .order("created_at", { ascending: true });

    if (fetchError) {
      throw new Error("Failed to fetch donations. Please try again later.");
    }

    if (!donations || donations.length === 0) {
      throw new Error("No donations available for allocation.");
    }

    // Step 2: Calculate total available funds
    const totalFunds = donations.reduce((sum, donation) => sum + (donation.remaining_amount ?? 0), 0);

    if (totalFunds < formData.amount!) {
      throw new Error("Insufficient funds to complete the allocation.");
    }

    // Step 3: Allocate amount using FIFO
    let remainingToAllocate = formData.amount!;
    const allocationLog: { donation_id: number; allocated_amount: number, program_id: number, remaining_allocated_amount: number}[] = [];

    for (const donation of donations) {
      if (remainingToAllocate <= 0) break;

      const allocation = Math.min(remainingToAllocate, donation.remaining_amount!);
      remainingToAllocate -= allocation;

      // Update donation remaining amount in the database
      const { error: updateError } = await supabase
        .from("donation")
        .update({ remaining_amount: donation.remaining_amount! - allocation })
        .eq("donation_id", donation.donation_id);

      if (updateError) {
        throw new Error(`Failed to update donation ID ${donation.donation_id}.`);
      }

      allocationLog.push({
        donation_id: donation.donation_id,
        allocated_amount: allocation,
        program_id: formData.program_id!,
        remaining_allocated_amount: allocation
      });
    }

    console.log("Allocation log:", allocationLog);

    for (const logData of allocationLog) {
      
      if (logData.allocated_amount > 0) {
        const { error: donationLogError } = await supabase
          .from("donation_allocation_log")
          .insert(logData)
          .select()
  
        if (donationLogError) {  
          console.log(donationLogError);
          throw new Error("Failed to insert allocation log, Please try again");
          }
      }
    }
  
    

    // Step 4: Insert the allocation record into the donation_allocation table
    const { data: allocationData, error: insertError } = await supabase
      .from("donation_allocation")
      .upsert(formData)
      .select()
      .single();

    if (insertError) {
      console.log(insertError);
      throw new Error("Failed to record the allocation. Please try again later.");
    }

    // Step 5: Updating Prorams Table with total sum of all donations of the programs
    const { data: allocatedDonation, error: donationAllocationError } = await supabase
      .from("donation_allocation")
      .select()
      .eq("program_id", allocationData.program_id!);
    
    if (donationAllocationError) throw donationAllocationError;

    const totalSumOfProgramDonations = allocatedDonation.reduce((sum, donation) => sum + donation.amount!, 0);

    // Step 6: Storing the total sum of donation amount to the programs table
    // Fetch the current value of total_remaining_donation
    const { data: totalRemainingDonation, error: errorTotalRemainingDonation } = await supabase
      .from("programs")
      .select("total_remaining_donation")
      .eq("program_id", allocationData.program_id!)
      .single();
    
    if (errorTotalRemainingDonation) {
      console.error("Error fetching current donation:", errorTotalRemainingDonation!.message);
    } else {
      const currentRemainingDonation = totalRemainingDonation?.total_remaining_donation || 0;

      // Calculate new total_remaining_donation
      const updatedRemainingDonation = currentRemainingDonation + formData.amount!;

      const { data, error } = await supabase
        .from("programs")
        .update({
          "total_allocated_donation": totalSumOfProgramDonations,
          "total_remaining_donation": updatedRemainingDonation,
        })
        .eq("program_id", allocationData.program_id!)
        .select();
      
      if (error) throw new Error(error.message);
    }
    


    return { success: true, data: allocationData };

  } catch (error: any) {
    // Handle and return the error to be displayed as a toast
    console.error("Error in donationAllocation:", error.message);
    return { success: false, error: error.message };
  }
}

