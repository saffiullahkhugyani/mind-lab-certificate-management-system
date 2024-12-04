"use server"

import { createClient } from "@/lib/supabase/server"
import { DonationAllocation, Programs } from "@/types/types";



export async function addProgram(programData: Programs) {
    const supabase = createClient();
    const { data, error } = await supabase.from("programs")
        .insert(programData).select()
    
    if (data != null) {
        console.log("Program added successfully", data)
    } else {
        console.log("Error while adding program", error)
    }

    return data;
}

export async function programsList() {
  const supabase = createClient();
  const { data, error } = await supabase.from("programs")
    .select().order("program_id", { ascending: true });
    
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
    const allocationLog: { donation_id: number; allocated: number }[] = [];

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

      allocationLog.push({ donation_id: donation.donation_id, allocated: allocation });
    }

    console.log("Allocation log:", allocationLog);

    // Step 4: Insert the allocation record into the donation_allocation table
    const { data: allocationData, error: insertError } = await supabase
      .from("donation_allocation")
      .upsert(formData)
      .select();

    if (insertError) {
      console.log(insertError);
      throw new Error("Failed to record the allocation. Please try again later.");
    }

    return { success: true, data: allocationData };

  } catch (error: any) {
    // Handle and return the error to be displayed as a toast
    console.error("Error in donationAllocation:", error.message);
    return { success: false, error: error.message };
  }
}

