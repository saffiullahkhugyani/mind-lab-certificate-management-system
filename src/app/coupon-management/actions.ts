'use server'

import { createClient } from "@/lib/supabase/server";
import { Coupons, StudentInterestData } from "@/types/types";


{/*Fething clubs list */}
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

{/* Fetching programs list*/}
export async function programsList() {
  const supabase = createClient();
  const { data, error } = await supabase.from("programs")
    .select().order("program_id", { ascending: true });
    
    if (data != null)
  {
    // console.log("programs list: ",data);
  } else {
    console.log("Error fetching programs list: ",error)
  }

  return data;
  
}

{/* Fetching students list */ }
{/* For now fetching all users will be fixed when we add role based access control */}
export async function studentsList() {
  const supabase = createClient();
  try {
    const { data: students, error: fetchError } = await supabase
      .from("profiles")
      .select("id, name, email");
  
    
    if (fetchError) {
      console.log(fetchError)
      throw new Error(`Failed to fetch students list. Please try again later.`);
    }

    return {success: true, data: students}
    
  } catch (error: any) {
    // Handle and return the error to be displayed as a toast
    console.error("Error in fetchinng students", error.message);
    return { success: false, error: error.message };
  }

  
}


{ /* adding/generating studnets coupons */ }
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

{/* Inserting student intrest record data */ }
// export async function AddStudentInterest(studentInterest: StudentInterestData[]) {
//   const supabase = createClient();

//   for (const interest of studentInterest) {
//     const { user_email, club_id, program_id, date_submitted } = interest;

//     try {
//     // Check if the record already exists
//     // Build dynamic filters to handle null values
//     let query = supabase.from("student_interest").select();

//     if (user_email) {
//       query = query.eq("user_email", user_email);
//     }

//     if (program_id !== null) {
//       query = query.eq("program_id", program_id!);
//     }

//     if (club_id !== null) {
//       query = query.eq("club_id", club_id!);
//     }

//     // Execute the query
//     const { data: existingRecord, error: existingError } = await query.single();

//     if (existingError) {
//       if (existingError.code !== "PGRST116") { // Handle unexpected errors
//         console.error("Error checking for existing record:", existingError);
//         continue; // Skip to the next record
//       }
//     }

//     if (!existingRecord) {
//       // Insert new record if it doesn't exist
//       const { error: insertError } = await supabase
//         .from("student_interest")
//         .insert({
//           user_email,
//           club_id,
//           program_id,
//           date_submitted,
//         });

//       if (insertError) {
//         console.error("Error inserting record:", insertError);
//       } else {
//         console.log("Record inserted successfully:", interest);
//       }
//     } else {
      
//         console.log("Record already exists, skipping:", interest);
//       }

//     } catch (error: any) {
//       return {success: false, message: `Error: ${error.message}`}
//     }
//   }

//     return {success: true, message: "Data updated successfully"}

// }

export async function AddStudentInterest(studentInterest: StudentInterestData[]) {
  const supabase = createClient();
  const resultMessages: string[] = []; // Store messages for each record

  for (const interest of studentInterest) {
    const { user_email, club_id, program_id, date_submitted } = interest;

    try {
      // Check if the record already exists
      let query = supabase.from("student_interest").select();

      if (user_email) {
        query = query.eq("user_email", user_email);
      }

      if (program_id !== null) {
        query = query.eq("program_id", program_id!);
      }

      if (club_id !== null) {
        query = query.eq("club_id", club_id!);
      }

      // Execute the query
      const { data: existingRecord, error: existingError } = await query.single();

      if (existingError) {
        if (existingError.code !== "PGRST116") {
          console.error("Error checking for existing record:", existingError);
          resultMessages.push(`Error checking for record ${user_email}: ${existingError.message}`);
          continue; // Skip to the next record
        }
      }

      if (!existingRecord) {
        // Insert new record if it doesn't exist
        const { error: insertError } = await supabase
          .from("student_interest")
          .insert({
            user_email,
            club_id,
            program_id,
            date_submitted,
          }).select();

        if (insertError) {
          console.error("Error inserting record:", insertError);
          resultMessages.push(`Error inserting record for ${user_email}: ${insertError.message}`);
        } else {
          resultMessages.push(`Data for ${user_email} inserted successfully`);
          // const { data: userProfile, error: userProfileError } = await supabase
          //   .from('profiles')
          //   .select()
          //   .eq("email", user_email!)
          //   .single();
          // console.log(`Yes user exists ${userProfile}`); 
        
        }
      } else {
        console.log("Record already exists, skipping:", interest);
        resultMessages.push(`Data for ${user_email} already exists`);
      }

    } catch (error: any) {
      resultMessages.push(`Error: ${error.message} for ${user_email}`);
    }
  }

  // Return all accumulated messages
  return {
    success: true,
    messages: resultMessages,
  };
}



{/* Fetching coupons list */}
export async function couponsList() {
  const supabase = createClient();
  try {
    const { data: coupons, error: fetchError } = await supabase
      .from("coupons")
      .select(`coupon_id,
        profiles!coupons_student_id_fkey (
      name,
      email
    ),
        clubs!coupons_club_id_fkey (
      club_name
    ),
        programs!coupons_program_id_fkey (
      program_english_name
    )`);
  
    
    if (fetchError) {
      console.log(fetchError)
      throw new Error(`Failed to fetch coupons list. Please try again later.`);
    }

    const mappedCouponWithDetails = coupons.map((coupon) => ({
      coupon_id: coupon.coupon_id,
      student_name: coupon.profiles?.name,
      student_email: coupon.profiles?.email,
      program_name: coupon.programs?.program_english_name
    }))

    // console.log(mappedCouponWithDetails);

    return {success: true, data: coupons}
    
  } catch (error: any) {
    // Handle and return the error to be displayed as a toast
    console.error("Error in fetchinng Coupons", error.message);
    return { success: false, error: error.message };
  }
  
}

{ /* FUNCTIONS */}
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