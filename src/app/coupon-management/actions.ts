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
      .select("id, name, email")
      .eq("role_id", 4);
  
    
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
  const {
    program_id,
    student_id,
    student_email,
    coupon_duration,
    start_period,
    club_id
  } = formData;
  
  try {

    // Manual Assignment: Check only if the user has already coupons
    if (isManual && student_id) {
      const { data: existingCoupon, error: existingCouponError } = await supabase
        .from("coupon_user_mapping")
        .select("id, coupons!inner( club_id, program_id), profiles!inner(id)")
        .eq("user_id", student_id)
        .eq("coupons.program_id", program_id!);
      
      // console.log("Error for existing coupons: ", existingCouponError);
      // console.log("Data fetched: ", existingCoupon);

      if (existingCoupon?.length! > 0)
        throw new Error("Coupon already exists for this user and program.");
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

    // Step 2 Fetching donation log for the program
    const { data: donationAllocationLog, error: donationAllocationLogError } = await supabase
      .from("donation_allocation_log")
      .select("id, program_id, donation!inner(donation_id, sponsor_id), allocated_amount, remaining_allocated_amount")
      .gte("remaining_allocated_amount", 0)
      .eq("program_id", program_id!)
      .order("id", {ascending: true});
    
    if (donationAllocationLogError) throw new Error("Failed to fetch donation allocation logs");
      
    // assinging donation logs   
    let donationLogs = donationAllocationLog;

    // Step 3 fetching data for cancelled sponsor support
    if (isManual && student_id) {
      const { data: cancelSponsorSupport, error: cancelSponsorSupportError } = await supabase
        .from("sponsor_student_support")
        .select("*, sponsor!inner(sponsor_id, name)")
        .eq("student_id", student_id)
        .eq("program_id", program_id!)
        .eq("support_status", false);
        
      // throw error if there is sponsor support error
      if (cancelSponsorSupportError) throw new Error(cancelSponsorSupportError.message);
        
      // if valid sponsor data perform filter
      if (cancelSponsorSupport && cancelSponsorSupport.length > 0) {
        
        // create a set of sponsor IDs with support_status: false
        const unSupportedSponsorIds = new Set(
          cancelSponsorSupport?.filter((support) => !support.support_status)
            .map((support) => support.sponsor_id)
        );

        // Filter to keep only active supporters
        const filteredLogs = donationAllocationLog.filter(
          (log) => !unSupportedSponsorIds.has(log.donation.sponsor_id)
        );
    
          donationLogs = filteredLogs; 
      
        // check if sum of remainging donations are sufficient in donationLogs
        const couponDurationInMonths = parseInt(coupon_duration!);
        const totalRemainingDonationAmount = donationLogs.reduce
          ((sum, log) => sum + log.remaining_allocated_amount, 0);
    
        // throw error if the sum of remaing donation for program in filtered log is less then 0
        const value = totalRemainingDonationAmount - (subscriptionValue * couponDurationInMonths);
        if (totalRemainingDonationAmount - (subscriptionValue * couponDurationInMonths) < 0) {
          const notiLogs = cancelSponsorSupport.map((cancel) =>
            ` support canceled by ${cancel.sponsor.name} on ${new Date(cancel.created_at).toDateString()}`);

          throw new Error(notiLogs.join(' ,'));
        }
      
    }
      // if (cancelSponsorSupport) throw new Error("testing mode");
    }

    // Step 4: Check if donations are sufficient
    const couponDurationInMonths = parseInt(coupon_duration!); 
    let remainingDeduction = subscriptionValue * couponDurationInMonths;
    const deduction = totalRemainingDonation! - remainingDeduction;

    if (deduction < 0)
      throw new Error("Insufficient donations for this program")
    
    // Step 5: Update the donation record with deducted amount
    const { error: updateError } = await supabase
      .from("programs")
      .update({ "total_remaining_donation": deduction })
      .eq("program_id", program_id!);
      
    if (updateError) throw new Error("Failed to update remaining donation.");

    // Track remaining coupons to be allocated
    let remainingCoupons = couponDurationInMonths;
    const donationLinks: { donation_id: number, num_coupons: number}[] = [];
    let remainingToDeductFromLogs = remainingDeduction;

    
    // step 6: revising logic for deductions and coupon donation link
    for (const log of donationLogs) {
      if (remainingCoupons <= 0) break;
      
      const couponsFromThisDonation = Math.min(
        remainingCoupons,
        Math.floor(log.remaining_allocated_amount / Number(program.subscription_value))
      );
      remainingCoupons -= couponsFromThisDonation;

      donationLinks.push({
        donation_id: log.donation.donation_id,
        num_coupons: couponsFromThisDonation,
      });

      console.log(donationLinks);

      
      const deduct = Math.min(remainingToDeductFromLogs, log.remaining_allocated_amount);
      remainingToDeductFromLogs -= deduct;

      console.log("after amount: ", remainingToDeductFromLogs);

      
      // Step 7 update the donation_allocation_log table with the deducted remaining amount
      const { data: updateAllocatedLogs, error: logUpdateError } = await supabase
        .from("donation_allocation_log")
        .update({remaining_allocated_amount: log.remaining_allocated_amount - deduct  })
        .eq("program_id", log.program_id)
        .eq("id", log.id);
      
      if (logUpdateError) throw new Error(logUpdateError.message);
    }

      // Step 8: fetching start date on the basis of the start_period
      const startDate = calculateStartDate(start_period!);
      const finalData = {
        club_id,
        program_id,
        coupon_duration,
        start_period,
        start_date: startDate,
        number_of_coupons: couponDurationInMonths,
      };

      // Step 9: Inserting coupon record
      const { data: couponData , error: insertCouponError } = await supabase
        .from("coupons")
        .insert(finalData)
        .select()
        .single();
      
    if (insertCouponError) throw new Error("Failed to insert coupon record.");
    
    {/*Link the coupon to the donation*/ }
    for (const link of donationLinks) {
      if (link.num_coupons > 0) {
        const { error: linkError } = await supabase
          .from("coupon_donation_link")
          .insert({
            coupon_id: couponData.coupon_id,
            donation_id: link.donation_id,
            num_of_coupons: link.num_coupons
          });
        
          console.log(linkError);
        if (linkError)
          throw new Error("Failed to link coupon to donation");
      }
    }

      // Step 10: Mapping user to coupons
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

      // Step 11: Generate and storing coupon codes
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

  try {
    // Step 1: Fetch all data from the `student_interest` table
    const { data: interestData, error: interestError } = await supabase
      .from('student_interest')
      .select("*")
      .eq("club_id", clubId);

    if (interestError) {
      console.error("Error fetching student interest:", interestError.message);
      return { success: false, message: "Failed to fetch student interest data." };
    }

    if (!interestData || interestData.length === 0) {
      return { success: false, message: "No students found for the selected club." };
    }

    // Step 2: Filter students with and without the programId
    const studentsWithProgram = interestData.filter(student => student.program_id === programId);
    const studentsWithoutProgram = interestData.filter(student => !student.program_id);

    // Step 3: Process students without a program (assign program and generate coupons)
    for (const student of studentsWithoutProgram) {
      // Check if the student already has the selected program in their interest
      const isProgramAlreadyAssigned = interestData.some(
        s => s.user_email === student.user_email && s.program_id === programId
      );

      if (isProgramAlreadyAssigned) {
        console.log(`Skipping student ${student.user_email} - Program already assigned.`);
        continue;
      }

      // Assign the selected program to the student
      const { error: updateError } = await supabase
        .from('student_interest')
        .update({ program_id: programId })
        .eq('id', student.id);

      if (updateError) {
        console.error(`Failed to assign program to ${student.user_email}:`, updateError.message);
        errorList.push({ email: student.user_email!, message: "Failed to assign program." });
      } else {
        console.log(`Assigned program ${programId} to student ${student.user_email}.`);

        // Add the student to the "studentsWithProgram" list for coupon generation
        studentsWithProgram.push({ ...student, program_id: programId });
      }
    }

    // Step 4: Process students with the program for coupons
    if (studentsWithProgram.length > 0) {
      console.log(`Found ${studentsWithProgram.length} students with the selected program.`);

      // Pre-fetch all existing coupons to avoid repeated queries
      const { data: userCoupons, error: userCouponError } = await supabase
        .from('coupon_user_mapping')
        .select("id, coupons (coupon_id, program_id), profiles (email)");

      const { data: interestCoupons, error: interestCouponError } = await supabase
        .from('coupon_interest_mapping')
        .select("id, student_email, coupons (coupon_id, program_id)");

      if (userCouponError || interestCouponError) {
        console.error(
          "Error fetching coupons data:",
          userCouponError?.message || interestCouponError?.message
        );
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

      for (const student of studentsWithProgram) {
        const { user_email  } = student;

        // Check if the student already has a coupon for this program
        const userHasCoupon = allCoupons.some(
          (coupon) => coupon.email === user_email && coupon.programId === programId
        );

        if (!userHasCoupon) {
          // Generate a coupon for the student
          const { data: registeredUser } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", user_email!)
            .single(); // Get a single record if found

          // Construct the newCoupon object
          const newCoupon = registeredUser
            ? {
                club_id: clubId,
                program_id: programId,
                student_id: registeredUser.id, // For registered users
                coupon_duration: "1 month",
                start_period: "Future period",
              }
            : {
                club_id: clubId,
                program_id: programId,
                student_email: user_email, // For unregistered users
                coupon_duration: "1 month",
                start_period: "Future period",
              };

          // Add the coupon using the existing logic
          const addCouponResult = await addStudentCoupon(newCoupon);

          if (addCouponResult.success) {
            console.log(`Coupon added: ${addCouponResult.data}`);
            addedCouponsList.push(addCouponResult.data!);
          } else {
            console.error(`Error adding coupon: ${addCouponResult.data}`);
            errorList.push({ email: user_email!, message: addCouponResult.error });
          }
        } else {
          console.log(`User ${user_email} already has a coupon for program ${programId}`);
        }
      }
    }

    const { data: totalStudents, error: totalError } = await supabase
      .from("coupons")
      .select("*")
      .eq("program_id", programId);

    // Return the results
    return {
      success: true,
      addedCoupons: addedCouponsList,
      totalStudents: totalStudents?.length,
      errors: errorList,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
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
      program.total_remaining_donation! >= Number(program.subscription_value)
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

async function validateSponsorSupport(student_id: string, program_id: number) {
  const supabase = createClient()
  const { data: sponsorSupport, error: sponsorSupportError } = await supabase
    .from("sponsor_student_support")
    .select()
    .eq("student_id", student_id)
    .eq("program_id", program_id)
    .eq("support_status", false);

  if (sponsorSupportError) throw new Error(sponsorSupportError.message);

  if (!sponsorSupport || sponsorSupport.length <= 0) {
    return { success: false, error: "No unsupported sponsors found for this student." };
  }

  return {success: true, data: sponsorSupport};
}