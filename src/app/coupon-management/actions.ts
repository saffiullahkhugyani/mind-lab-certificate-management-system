'use server'

import { createClient } from "@/lib/supabase/server";
import { Coupons } from "@/types/types";

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

export async function studentsList() {
  const supabase = createClient();
  try {
    const { data: students, error: fetchError } = await supabase
      .from("profiles")
      .select("id, name");
  
    
    if (fetchError) {
      console.log(fetchError)
      throw new Error(`Failed to fetch students list. Please try again later.`);
    }

    console.log(students);

    return {success: true, data: students}
    
  } catch (error: any) {
    // Handle and return the error to be displayed as a toast
    console.error("Error in fetchinng students", error.message);
    return { success: false, error: error.message };
  }

  
}


// adding/generating studnets coupons
export async function addStudentCoupon(formData: Coupons) {
  const supabase = createClient();
  const { program_id, student_id, coupon_duration, start_period, start_date, number_of_coupons, ...rest} = formData;
  
  try {
    // Step 1: Fetching program details
    const { data: program, error: programError } = await supabase
      .from("programs")
      .select("*")
      .eq("program_id", program_id!)
      .single();
    
    if (programError) throw programError;

    // subscription value and remaining donation
    const subscriptionValue = Number(program.subscription_value);
    const totalRemainingDonation = program.total_remaining_donation;

    // Step 2: Check if donations are sufficient
    const couponDurationInMonths = parseInt(coupon_duration!); 
    let remainingDeduction = subscriptionValue * couponDurationInMonths;
    const deduction = totalRemainingDonation - remainingDeduction;

    if (totalRemainingDonation >= subscriptionValue && deduction >= 0) {
     

      // Step 3: Update the donation record with deducted amount
      const { error: updateError } = await supabase
        .from("programs")
        .update({ "total_remaining_donation": deduction })
        .eq("program_id", program_id!);
      
      if (updateError) throw updateError;

      // Step 3.5: fetching start date on the basis of the start_period
      const startDate = calculateStartDate(start_period!);
      const finalData = {
        ...rest, program_id, student_id, coupon_duration, start_period,
        start_date: startDate, number_of_coupons: couponDurationInMonths,
      };

      // Step 4: Inserting coupon record
      const { data: couponData , error: insertCouponError } = await supabase
        .from("coupons")
        .insert(finalData)
        .select()
        .single();
      
      // Generate and storing coupon codes
      await generateAndStoreCouponCodes(couponData!);
      
      return { success: true, data: couponData}

    } else {
      // Step 0: handling insufficient donations
      return {success: false, data: "Insufficient Donations for this program."}
    }
    
  } catch (error: any) {
    // Handle and return the error to be displayed as a toast
    console.error("Error in fetchinng students", error.message);
    return { success: false, error: error.message };
  }
}

async function generateAndStoreCouponCodes(coupon: Coupons) {

  console.log("coupons from database: ", coupon);
  const supabase = createClient();
  if (!coupon.coupon_id || !coupon.number_of_coupons) {
    console.log("Invalid coupon data: Missing coupon_id or number of coupons");
    return;
  }

   // Generate unique codes for coupon
   for (let i = 0; i < coupon.number_of_coupons!; i++) {
     let newCode = generateUniqueCode(coupon.coupon_id);

     // Inserting coupon codes
     const { data, error } = await supabase
       .from('coupon_codes')
       .insert({ coupon_id: coupon.coupon_id, coupon_code: newCode })
       .select();

   }



}

function generateUniqueCode(couponId: number): string {
  const timestamp = Date.now(); // Current time in milliseconds
  const randomOffset = Math.floor(Math.random() * 1000); // Random value to add uniqueness

  // Combine the timestamp and couponId with the random offset
  const rawCode = timestamp + couponId + randomOffset;

  // Reduce the number to 5 digits using modulo
  const uniqueCode = rawCode % 100000;

  // Return the code as a string, padded with zeros if necessary
  return uniqueCode.toString().padStart(5, "0");
}

// Calculate the start date based on the period
const calculateStartDate = (period: string): string => {
  const today = new Date();
  let startDate: Date;

  if (period.toLowerCase() === "current period") {
    // Set to 1st day of the current month
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (period.toLowerCase() === "future period") {
    // Set to 1st day of the next month
    startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  } else {
    throw new Error("Invalid period value");
  }

  return startDate.toLocaleDateString();
};