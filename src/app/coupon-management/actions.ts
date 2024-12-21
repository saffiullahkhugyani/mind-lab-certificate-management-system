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
export async function addStudentCoupon(formData: Coupons, isManual = false) {
  const supabase = createClient();
  const { program_id,
    student_id,
    student_email,
    coupon_duration,
    start_period,
    start_date,
    number_of_coupons,
    club_id } = formData;
  
  try {

    // Manual Assignment: Check only if the user has already coupons
    if (isManual && student_id) {
      const { data: existingCoupon, error: existingCouponError } = await supabase
        .from("coupon_user_mapping")
        .select("id, coupons!inner( club_id, program_id), profiles!inner(id)")
        .eq("user_id", student_id)
        .eq("coupons.program_id", program_id!);
      
      console.log("Error for existing coupons: ", existingCouponError);
      console.log("Data fetched: ", existingCoupon);

      if (existingCoupon?.length! > 0) {
        return { success: false, error: "Coupon already exists for this user and program." };
      }
    }

    // Step 1: Fetching program details
    const { data: program, error: programError } = await supabase
      .from("programs")
      .select("*")
      .eq("program_id", program_id!)
      .single();
    
    if (programError) throw new Error("Failed to fetch program details");

    // subscription value and remaining donation
    const subscriptionValue = Number(program.subscription_value);
    const totalRemainingDonation = program.total_remaining_donation;

    // Step 2: Check if donations are sufficient
    const couponDurationInMonths = parseInt(coupon_duration!); 
    let remainingDeduction = subscriptionValue * couponDurationInMonths;
    const deduction = totalRemainingDonation - remainingDeduction;

    if (deduction < 0) {
      return {success: false, error: "Insufficient donations for this program"}
    }

      // Step 3: Update the donation record with deducted amount
      const { error: updateError } = await supabase
        .from("programs")
        .update({ "total_remaining_donation": deduction })
        .eq("program_id", program_id!);
      
      if (updateError) throw new Error("Failed to update remaining donation.");

      // Step 3.5: fetching start date on the basis of the start_period
      const startDate = calculateStartDate(start_period!);
      const finalData = {
        club_id,
        program_id,
        coupon_duration,
        start_period,
        start_date: startDate,
        number_of_coupons: couponDurationInMonths,
      };

      // Step 4: Inserting coupon record
      const { data: couponData , error: insertCouponError } = await supabase
        .from("coupons")
        .insert(finalData)
        .select()
        .single();
      
      if (insertCouponError) throw new Error("Failed to insert coupon record.");

      // Step 5: Mapping user to coupons
      const mapping = student_id
        ? { user_id: student_id, coupon_id: couponData.coupon_id }
        : { student_email, coupon_id: couponData.coupon_id };
      
      const mappingTable = student_id
        ? "coupon_user_mapping"
        : "coupon_interest_mapping";
      
      const { error: mappingError } = await supabase
        .from(mappingTable)
        .insert(mapping)
      
      if (mappingError) throw new Error(`Failed to map user ${mappingTable}`);

      // Step 6: Generate and storing coupon codes
      await generateAndStoreCouponCodes(couponData!);
      
      return { success: true, data: couponData}
    
  } catch (error: any) {
    // Handle and return the error to be displayed as a toast
    console.error("Error: ", error.message);
    return { success: false, error: error.message };
  }
}

{ /* Add student interest function */}
export async function AddStudentInterest(studentInterest: StudentInterestData[]) {
  const supabase = createClient();
  const resultMessages: string[] = [];
  const insertedInterestData: StudentInterestData[] = [];
  let successCount = 0;
  let skipCount = 0;
  let failureCount = 0;

  try {
    // Fetch all existing records in one query
    const { data: existingRecords, error: fetchError } = await supabase
      .from("student_interest")
      .select("user_email, club_id, program_id");

    if (fetchError) {
      console.error("Error fetching existing records:", fetchError);
      return {
        success: false,
        messages: [`Failed to fetch existing records: ${fetchError.message}`],
      };
    }

    for (const interest of studentInterest) {
      const { user_email, club_id, program_id, date_submitted } = interest;

      // Check for duplicates
      const isDuplicate = existingRecords?.some((record) => {

        // Check if the user_email and club_id match
        const emailAndClubMatch =
          record.user_email === user_email && record.club_id === club_id;

          // Check if the program_id matches or is redundant
          const programMatch =
          record.program_id === program_id;

        // Skip inserting if email and club match and program conditions overlap
        return emailAndClubMatch && programMatch;
        
    });

      if (isDuplicate) {
        skipCount++;
        resultMessages.push(`Record for ${user_email} with club ${club_id} and program ${program_id} already exists.`);
        continue;
      }

      // storing interest record that is to be inserted
      insertedInterestData.push(interest);

      // Insert the record if not a duplicate
      const { data: insertedData, error: insertError } = await supabase
        .from("student_interest")
        .insert({
          user_email,
          club_id,
          program_id,
          date_submitted,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting record:", insertError);
        resultMessages.push(`Error inserting record for ${user_email}: ${insertError.message}`);
        failureCount++;
      } else {
        successCount++;
        resultMessages.push(`Record for ${user_email} inserted successfully.`);
        // insertedInterestData.push(insertedData);

        // const { data: user, error: userError } = await supabase
        //   .from("profiles")
        //   .select("id")
        //   .eq("email", user_email!)
        //   .single();
        
        // if(userError)
        //   console.log(`Error: ${userError.message}`)
        
        // if (user) {
        //   const { data: interestMapping, error: mappingError } = await supabase
        //     .from("user_interest_mapping")
        //     .insert({ user_id: user.id, interest_id: insertedData.id })
        //     .select()
        //     .single()
        // }

      }
    }
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      messages: [`Unexpected error occurred: ${error.message}`],
    };
  }

  return {
    success: true,
    messages: resultMessages,
    summary: {
      successCount,
      skipCount,
      failureCount,
    },
    data: insertedInterestData,
  };
}




{/* Fetching coupons list */}
export async function couponsList() {
  const supabase = createClient();
  try {
    const { data: coupons, error: fetchError } = await supabase
      .from("coupons")
      .select("*")
    
    if (fetchError) {
      console.log(fetchError)
      throw new Error(`Failed to fetch coupons list. Please try again later.`);
    }

    return {success: true, data: coupons}
    
  } catch (error: any) {
    // Handle and return the error to be displayed as a toast
    console.error("Error in fetchinng Coupons", error.message);
    return { success: false, error: error.message };
  }
  
}

export async function couponBatchProcess(clubId: number, programId: number) {
  const supabase = createClient();
  let addedCouponsList: Coupons[] = []; // to store successfully added coupons
  let errorList: { email: string; message: string }[] = []; // to store errors with email

  // Step 1: Fetch data from `student_interest` table
  const { data: interestData, error: interestError } = await supabase
    .from('student_interest')
    .select("*")
    .eq("club_id", clubId)
    .eq("program_id", programId);

  if (interestError) {
    console.error("Error fetching student interest:", interestError.message);
    return { success: false, message: "Failed to fetch student interest data." }
  }
  
// If no matching records for club and program, fetch students with null `program_id` in the same club
  let studentsWithNullProgram: StudentInterestData[] = [];
  if (!interestData || interestData.length === 0) {

    // fetching students with 'null' program
     const { data: nullProgramData, error: nullProgramError } = await supabase
      .from("student_interest")
      .select("*")
      .eq("club_id", clubId)
      .is("program_id", null);
    
     if (nullProgramError) {
      console.error(
        "Error fetching students with null program:",
        nullProgramError.message
      );
      return { success: false, message: "Failed to fetch students with null program." };
    }

    if (!nullProgramData || nullProgramData.length === 0) {
      return { success: false, message: "No Students for the selected club" };  
    }

    studentsWithNullProgram = nullProgramData || [];
    // return { success: false, message: "No Students for the selected club and program" };
  }

  // Combine interest data and null-program data
  const studentsToProcess: StudentInterestData[] = interestData || [];

  for (const student of studentsWithNullProgram) {
    // Assign the program with sufficient donation
    const sufficientProgram = await findProgramWithSufficientDonation(clubId);
    if (sufficientProgram) {
      student.program_id = sufficientProgram.program_id;
      studentsToProcess.push(student); // Add student to the processing list

      // Update student in interest table with program id
      const { data: updateInterestData, error: updateError } = await supabase
        .from("student_interest")
        .update({ "program_id": sufficientProgram.program_id })
        .eq("id", student.id!)
        .select()
        .single();

        console.log("Sufficient Program: ", sufficientProgram);
        console.log("Update Interest Data:", updateInterestData);
    }
  }


  // Step 2: Pre-fetch existing coupons for efficiency
  const { data: userCoupons, error: userCouponError } = await supabase
    .from('coupon_user_mapping')
    .select("id, coupons (coupon_id, program_id), profiles (email)");

  const { data: interestCoupons, error: interestCouponError } = await supabase
    .from('coupon_interest_mapping')
    .select("id, student_email, coupons (coupon_id, program_id)");

  if (userCouponError || interestCouponError) {
    console.error("Error fetching coupons data:", userCouponError?.message || interestCouponError?.message);
     return { success: false, message: "Failed to fetch existing coupons data." };
 
  }

  // Combine user and interest coupons for unified existence checks
  const allCoupons = [
    ...(userCoupons || []).map((mappedCoupons) => ({
      email: mappedCoupons.profiles?.email,
      programId: mappedCoupons.coupons?.program_id,
    })),
    ...(interestCoupons || []).map((mappedCoupons) => ({
      email: mappedCoupons.student_email,
      programId: mappedCoupons.coupons?.program_id,
    })),
  ];

  // Step 3: Process each user in the interest data
  for (const student of studentsToProcess) {
    const { user_email, program_id, club_id } = student;

    // Check if user already has a coupon in either table
    const userHasCoupon = allCoupons.some(
      (coupon) => coupon.email === user_email && coupon.programId === program_id
    );

    if (!userHasCoupon) {
      // Check if the user is registered
      const { data: registeredUser } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user_email!)
        .single(); // Get a single record if found

      // Construct the newCoupon object
      const newCoupon = registeredUser
        ? {
            club_id: club_id,
            program_id: program_id,
            student_id: registeredUser.id, // For registered users
            coupon_duration: "1 month",
            start_period: "Future period",
          }
        : {
            club_id: club_id,
            program_id: program_id,
            student_email: user_email, // For unregistered users
            coupon_duration: "1 month",
            start_period: "Future period",
          };

      // Pass the newCoupon to the existing addStudentCoupon function
      const addCouponResult = await addStudentCoupon(newCoupon);

      if (addCouponResult.success) {
        console.log(`Coupon added: ${addCouponResult.data}`);
        addedCouponsList.push(addCouponResult.data!);
      } else {
        console.error(`Error adding coupon: ${addCouponResult.data}`);
        errorList.push({ email: user_email!, message: addCouponResult.error });
      
      }
    } else {
      console.log(`User ${user_email} already has a coupon for program ${program_id}`);
    }
  }

  // Returning results for display o the UI
   return {
    success: true,
    message: "Batch process completed",
    addedCoupons: addedCouponsList,
    errors: errorList,
  };
}

{ /* FUNCTIONS */ }

// Helper function to find a program with sufficient donation
async function findProgramWithSufficientDonation(clubId: number) {
  const supabase = createClient();
  const { data: programs, error } = await supabase
    .from("programs")
    .select("*")
    .eq("club_id", clubId);

  if (error) {
    console.error("Error fetching programs:", error.message);
    return null;
  }

  // Find a program with enough donation
  return programs?.find(
    (program) =>
      program.total_remaining_donation >= Number(program.subscription_value)
  );
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