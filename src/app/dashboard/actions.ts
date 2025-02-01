"use server"

import { createClient } from "@/lib/supabase/server"
import { AllocatedProgramData, Coupons, DonationAllocationLogs, Programs, StudentSupport, Tag } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function studentList() {
    const supabase = createClient()
    
    try { 
        const { data: studentList, error: studentListError } = await supabase
            .from("profiles")
            .select("*")
            .in("role_id", [1,4]);
        
        if (studentListError) throw new Error(studentListError.message);
        
        const { data: certificateDetails, error: certificateDetailsError } = await supabase
            .from('certificate_v1_v2_mapping')
            .select("user_id, certificate_master!inner(*)");
        
        if (certificateDetailsError) throw new Error(certificateDetailsError.message);
        
        const certificateData = certificateDetails.map((certificate) => {
           
            const { user_id, certificate_master } = certificate;

            /// Safely handle the `tags` field
            const tags = Array.isArray(certificate_master.tags)
                ? (certificate_master.tags as Tag[]).map((tag) => ({
                    tag_name: tag!.tag_name,
                    hours: tag!.hours,
                }))
            : []; // Fallback if `tags` is not an array

        return {
            user_id,
            ...certificate_master, // Spread all other properties from `certificate_master`
            tags, // Replace tags with the processed tags array
  };
           
        })

        return {
            success: true, data: {
                studentList: studentList,
                certificateData: certificateData
            }
        };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
    
}


export async function clubList() {
    const supabase = createClient()
    
    try { 
        const { data: clubList, error: clubListError } = await supabase
            .from("clubs")
            .select("*");
        
        if (clubListError) throw new Error(clubListError.message);

        return {success: true, data: clubList}

    } catch (error: any) {
        return {success:false, error: error.message}
    }
    
}

export async function programList() {
    const supabase = createClient()
    
    try { 
        const { data: programList, error: programListError } = await supabase
            .from("programs")
            .select("*");
        
        if (programListError) throw new Error(programListError.message);

        return {success: true, data: programList}

    } catch (error: any) {
        return {success:false, error: error.message}
    }
    
}

export default async function sponsorData() {
    const supabase = createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;
    try {

        const { data: sponsorData, error: sponsorError } = await supabase
            .from("sponsor")
            .select("*, profiles (profile_image_url)")
            .eq("user_id",  userId!)
            .single();
        
        if (sponsorError) throw new Error(sponsorError.message);
        if (!sponsorData) throw new Error("Sponsor not found.");

        const { data: donationData, error: donationError } = await supabase
            .from("donation")
            .select("*")
            .eq("sponsor_id", sponsorData.sponsor_id)
            .order("donation_id");
        
        if (donationError) throw new Error(donationError.message);
        if (!donationData) throw new Error("No donations found.");
        
        // calculate the total donation amount
        const totalDonationAmount = donationData?.reduce(
            (sum, donation) => sum + (donation.amount || 0),
            0
        ) || 0;

        // calculate total remaining amount
        const totalRemainingDonation = donationData?.reduce(
            (sum, donation) => sum + (donation.remaining_amount || 0),
            0
        ) || 0;

        const { data: donationLog, error: donationLogError } = await supabase
            .from("donation_allocation_log")
            .select("id, allocated_amount, remaining_allocated_amount, donation!inner(sponsor!inner(*)), programs!inner(*), created_at")
            .eq("donation.sponsor.user_id", userId!)
            .order("id");
            
        
        if (donationLogError) throw new Error(donationLogError.message);
        if (!donationLog) throw new Error("No record found for allocated");

        const studentSupport = await studentSupportData(userId!);

        const uniqueStudents = new Set<string | null>();

        studentSupport.forEach(support => {
            if (support.user_id) {
                uniqueStudents.add(support.user_id);
            }
        })

        // console.log("Data for sponsor",
        //     donationLog!.map((log) => ({
        //         allocated_amount: log.allocated_amount,
        //         remaining_allocated_amount: log.remaining_allocated_amount,
        //         program_name: log.programs?.program_english_name,
        //         created_at: new Date(log.created_at).toISOString().split("T")[0],
        //     }))
        // );

        const donationAllocationInvoiceData = donationLog.map((log) =>  ({
            id: log.id,
            allocated_amount: log.allocated_amount,
            description: log.programs.description,
            subscription_value: log.programs.subscription_value,   
            remaining_allocated_amount: log.remaining_allocated_amount,
            program_id: log.programs.program_id,
            club_id: log.programs.club_id,
            program_name: log.programs?.program_english_name,
            period: log.programs.period,
            created_at: new Date(log.created_at).toISOString().split("T")[0],
            })
        )
        
        
      const shapedAllocatedProgramData = donationLog!.reduce<AllocatedProgramData[]>((acc, log) => {
        const programId = log.programs.program_id;
        const existing = acc.find(item => item.program_id === programId);
        if (existing) {
              
          // If program_id exists, update the allocated_amount
          existing.allocated_amount! += log.allocated_amount;
          existing.remaining_allocated_amount! += log.remaining_allocated_amount;
          existing.allocationDataCount! += 1;
              
        } else {
          // If not, add a new entry 
          acc.push({
            id: log.id,
            allocated_amount: log.allocated_amount,
            description: log.programs.description,
            subscription_value: log.programs.subscription_value,
            remaining_allocated_amount: log.remaining_allocated_amount,
            program_id: programId,
            club_id: log.programs.club_id,
            program_name: log.programs?.program_english_name,
            period: log.programs.period,
            created_at: new Date(log.created_at).toISOString().split("T")[0],
            allocationDataCount: 1,
          });
        }
        return acc;
      }, []);
        
        
      const shapedSponsorData = {
        sponsor_id: sponsorData.sponsor_id,
        name: sponsorData.name,
        email: sponsorData.email,
        number: sponsorData.phone_number,
        image: sponsorData.profiles?.profile_image_url,
        totalDonationAmount: totalDonationAmount,
        totalRemainingDonation: totalRemainingDonation,
        allocatedDonation: totalDonationAmount - totalRemainingDonation,
        programs_funded: shapedAllocatedProgramData?.length,
        student_supported: uniqueStudents.size,
      };

      return {
        success: true, data: {
          sponsorData: shapedSponsorData,
          allocatedProgramData: shapedAllocatedProgramData,
          donataionsData: donationData,
          donationAllocationInvoiceData: donationAllocationInvoiceData,
          studentSupport: studentSupport
        }
      };


     } catch(error:any) {
      console.log("Error in sponsor data:", error.message);
      return { success: false, error: error.message };
    }
}

async function studentSupportData(sponsorUid: string) {
  
    const supabase = createClient();

    const { data: couponDonationLink, error: couponDonationLinkError } = await supabase
        .from("coupon_donation_link")
        .select('coupons(*), donation!inner(donation_id, sponsor!inner(*)), num_of_coupons')
        .eq("donation.sponsor.user_id", sponsorUid);
    
    if (couponDonationLinkError) throw new Error(couponDonationLinkError.message);

    const { data: couponUserMapping, error: couponUserMappingError } = await supabase
        .from("coupon_user_mapping")
        .select("*");
    
    if (couponUserMappingError) throw new Error(couponUserMappingError.message);


  const customList: StudentSupport[] = [];

  couponDonationLink.forEach(donationData => {
    const couponId = donationData.coupons?.coupon_id;
    
    // Find all user mappings for this coupon
    const matchingMappings = couponUserMapping.filter(
      mapping => mapping.coupon_id === couponId
    );

    // If there are user mappings, create an entry for each user
    if (matchingMappings.length > 0) {
      matchingMappings.forEach(mapping => {
        customList.push({
          user_id: mapping.user_id,
          coupon_id: couponId!,
          donation_id: donationData.donation.donation_id,
          program_id: donationData.coupons?.program_id ?? null,
          num_of_coupons: donationData.num_of_coupons
        });
      });
      
    } else {
      // If no user mappings exist, create one entry with null user_id
      customList.push({
        user_id: null,
        coupon_id: couponId!,
        donation_id: donationData.donation.donation_id,
        program_id: donationData.coupons?.program_id ?? null,
        num_of_coupons: donationData.num_of_coupons
      });
    }
  });

  return customList;
}

export async function addStudentSupport(studentId: string, programId: number, sponsorId: number) {
    try {
        const supabase = createClient();

        const { data: exisitingSupport, error: exisitingSupportError } = await supabase
            .from("sponsor_student_support")
            .select("*")
            .eq("program_id", programId)
            .eq("student_id", studentId)
            .eq("sponsor_id", sponsorId);
        
        if (exisitingSupportError) throw new Error(exisitingSupportError.message);
        if (exisitingSupport.length > 0) throw new Error("Support already exists.")
        

        const { data: addSupport, error: addSupportError } = await supabase
            .from("sponsor_student_support")
            .insert({ sponsor_id: sponsorId, student_id: studentId, program_id: programId, support_status: true })
            .select()
            .single();
        
        if (addSupportError) throw new Error(addSupportError.message);

        return { success: true, data: addSupport };
    } catch (error: any) {
        
        return { success: false, error: error.message };
    }
}

export async function cancelStudentSupport(
  studentId: string,
  sponsorId: number,
  programs: Programs[],
) {
  const supabase = createClient();

  try {
    // Check existing support status
    const { data: existingSupport, error: existingError } = await supabase
      .from("sponsor_student_support")
      .select("*")
      .eq("student_id", studentId)
      .eq("sponsor_id", sponsorId)

    if (existingError) {
      throw new Error(existingError.message);
    }

    // // If support is already cancelled, return early
    // if (existingSupport && existingSupport.length > 0
    //   && !existingSupport?.at(0)!.support_status) {
    //   throw new Error("Support already cancelled.");
    // }

    // Prepare records for upsert 
    const recordsToUpsert = programs
      .filter(program => program.program_id) // Filter out programs with undefined program_id
      .map((program) => {
        const existingRecord = existingSupport?.find(
          (record) => record.program_id === program.program_id
        );
      
      // skip if program id is undefined or record is already cancelled
      if (!program.program_id || (existingRecord && !existingRecord.support_status)) {
        return null;
      }

      return {
        ...(existingRecord?.id ? { id: existingRecord.id } : {}),
        sponsor_id: sponsorId,
        student_id: studentId,
        program_id: program.program_id,
        support_status: false,
      }
      
      
    }) .filter((record): record is Exclude<typeof record, null> => record !== null); // Remove null records


    // Update or insert based on existing support
    // const supportData = {
    //   id:  existingSupport.at(0)?.id!,
    //   sponsor_id: sponsorId,
    //   student_id: studentId,
    //   program_id: programId,
    //   support_status: false,
    // };

    // if (existingSupport) {
    //   // Update existing support
    //   const { data: updatedSupport, error: updateError } = await supabase
    //     .from("sponsor_student_support")
    //     .upsert(supportData)
    //     .select()
    //     .single();

    //   if (updateError) throw new Error(updateError.message);
    //   return { success: true, data: updatedSupport };
    // } else {
    //   // Insert new support record
    //   const { data: newSupport, error: insertError } = await supabase
    //     .from("sponsor_student_support")
    //     .insert(supportData)
    //     .select()
    //     .single();

    //   if (insertError) throw new Error(insertError.message);
    //   return { success: true, data: newSupport };
    // }

    if (recordsToUpsert && recordsToUpsert.length > 0) {
      
      const { data: cancelSupport, error: cancelSupportError } = await supabase
      .from("sponsor_student_support")
      .upsert(recordsToUpsert)
      .select();
      
      console.log(cancelSupportError);
      if (cancelSupportError) throw new Error(cancelSupportError.message);
      
      console.log(recordsToUpsert);
      console.log(cancelSupport);
      return { success: true, data: cancelSupport };
    } else {
      throw new Error("support already cancelled.");
    }

  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

export async function assignStudentProgram(studentId: string, sponsorId: number) {

  try {
    const supanase = createClient();
    const { data: programsData, error: programsDataError } = await supanase
      .from("donation_allocation_log")
      .select(`*, donation!inner(donation_id, sponsor_id), 
      programs!inner(program_english_name,subscription_value,
      total_allocated_donation,total_remaining_donation, club_id)`)
      .gt("remaining_allocated_amount", 0)
      .eq("donation.sponsor_id", sponsorId)
      .order("id", { ascending: true });
      
    if (programsDataError) throw new Error(programsDataError.message);
      

    // const selectedProgram = programsData.find(
    //   (record) => record.remaining_allocated_amount >= Number(record.programs.subscription_value)
    // );

    const sortedRecords = [...programsData].sort(
      (a, b) => b.remaining_allocated_amount - a.remaining_allocated_amount
    );

    let selectedRecords = [];
    let sumAmount = 0;
    const requiredAmount = Number(sortedRecords[0]?.programs.subscription_value || 0);

    for (const record of sortedRecords) {
      sumAmount += record.remaining_allocated_amount;
      selectedRecords.push(record);
  
      if (sumAmount >= requiredAmount) {
        break;
      }
    }

    // If we didn't reach the required amount, reset selectedRecords to empty
    if (sumAmount < requiredAmount) {
      selectedRecords = [];
    }

    let finalResult = "testing";
    if (selectedRecords && selectedRecords.length > 0) {
      const couponData = {
        program_id: selectedRecords.at(0)?.program_id,
        student_id: studentId,
        coupon_duration: "1 month",
        start_period: "Future period",
        club_id: selectedRecords.at(0)?.programs.club_id,
      };
      
      const res = await addStudentCoupon(couponData, selectedRecords.at(0)?.programs!, sponsorId, selectedRecords);

      if (!res.success) {
        throw new Error(res.error);
      }

      const { data: studentName, error: studentNameError } = await supanase
        .from("profiles")
        .select("name")
        .eq("id", studentId)
        .single();
      
      if (studentNameError) throw new Error(studentNameError.message);

      const { data: programName, error: programNameError } = await supanase
        .from("programs")
        .select("program_english_name")
        .eq("program_id", res.data?.program_id!)
        .single();
      
      if (programNameError) throw new Error(programNameError?.message);

       finalResult = `Coupon of ${programName.program_english_name} assigned to ${studentName.name}`;

    } else {
      throw new Error("No sufficient donation for the programs");
      }
      
    return { success: true, data: finalResult! };

  } catch (error: any) {
    console.error(error.message);
    return { success: false, error: error.message };
    }
}


{ /* adding/generating studnets coupons */ }
export async function addStudentCoupon(
  couponData: Coupons,
  programDetails: Programs,
  sponsorId: Number,
  donationAllocationLog: DonationAllocationLogs[],) {
  try {
    const supabase = createClient();
    const { program_id, club_id, student_id, coupon_duration, start_period } = couponData;
    const { subscription_value, total_remaining_donation } = programDetails;

    // Step 1: checking if coupon already exists
    const { data: existingCoupon, error: existingCouponError } = await supabase
        .from("coupon_user_mapping")
        .select("id, coupons!inner( club_id, program_id), profiles!inner(id)")
        .eq("user_id", student_id!)
        .eq("coupons.program_id", program_id!);
    
    // return when exisiting coupon error
    if (existingCouponError) throw new Error(existingCouponError.message);

    // return when coupon already exists
    if (existingCoupon?.length! > 0) {
      throw new Error("coupon already exisits");
    }

    // Step 2: program data
    const subscriptionValue = Number(subscription_value);
    const totalRemainingDonation = total_remaining_donation;


    // Step 3: donation log data
    // const { data: donationAllocationLog, error: donationAllocationLogError } = await supabase
    //   .from("donation_allocation_log")
    //   .select(`id, program_id, donation!inner(donation_id, sponsor_id), 
    //     allocated_amount, remaining_allocated_amount`)
    //   .eq("id", donationAllocationLogId)

    // if (donationAllocationLogError) throw new Error("Failed to fetch donation allocation logs");
    

    // Step 4: fetching data for cancelled sponsor support
    const { data: cancelSponsorSupport, error: cancelSponsorSupportError } = await supabase
      .from("sponsor_student_support")
      .select("*, sponsor!inner(sponsor_id, name)")
      .eq("sponsor_id", sponsorId)
      .eq("student_id", student_id!)
      .eq("program_id", program_id!)
      .eq("support_status", false);
    
    console.log("cancelled support: ", cancelSponsorSupport);
        
      // throw error if there is sponsor support error
    if (cancelSponsorSupportError) throw new Error(cancelSponsorSupportError.message);
    if (cancelSponsorSupport && cancelSponsorSupport.length > 0) {
      throw new Error(`Support already cancelled`);
    }

    // Step 5: Check if donations are sufficient and update donation record
    const couponDurationInMonths = parseInt(coupon_duration!);
    let remainingDeduction = subscriptionValue * couponDurationInMonths;
    const deduction = totalRemainingDonation! - remainingDeduction;

    if (deduction < 0)
      throw new Error("Insufficient donations for this program");

    const { error: updateError } = await supabase
      .from("programs")
      .update({ "total_remaining_donation": deduction })
      .eq("program_id", program_id!);
      
    if (updateError) throw new Error("Failed to update remaining donation.");

    // Track remaining coupons to be allocated
    let remainingCoupons = couponDurationInMonths;
    const donationLinks: { donation_id: number, num_coupons: number}[] = [];
    let remainingToDeductFromLogs = remainingDeduction;

    // Step 6: Deduction logic and coupon Donation link
    // Sort logs by remaining amount and filter for those with >= 50% of subscription value
    const sortedLogs = [...donationAllocationLog].sort(
      (a, b) => b.remaining_allocated_amount! - a.remaining_allocated_amount!
    );

    // Find logs that have >= 50% of subscription value
    const halfSubscriptionValue = subscriptionValue / 2;
    const priorityLogs = sortedLogs.filter(
      log => log.remaining_allocated_amount! >= halfSubscriptionValue
    );

    // Process priority logs first, then remaining logs if needed
const logsToProcess = [...priorityLogs, ...sortedLogs.filter(log => !priorityLogs.includes(log))];

for (const log of logsToProcess) {
  // if (remainingCoupons <= 0) break;

  // For priority logs (>=50% of subscription), assign at least 1 coupon if possible
  if (log.remaining_allocated_amount! >= halfSubscriptionValue) {
    const couponsFromThisDonation = Math.max(
      1,
      Math.min(
        remainingCoupons,
        Math.floor(log.remaining_allocated_amount! / subscriptionValue)
      )
    );
    // remainingCoupons -= couponsFromThisDonation;

    donationLinks.push({
      donation_id: log.donation?.donation_id!,
      num_coupons: couponsFromThisDonation,
    });
  } else {
    // Original logic for non-priority logs
    const couponsFromThisDonation = Math.min(
      remainingCoupons,
      Math.floor(log.remaining_allocated_amount! / subscriptionValue)
    );
    
    if (couponsFromThisDonation > 0) {
      remainingCoupons -= couponsFromThisDonation;
      
      donationLinks.push({
        donation_id: log.donation?.donation_id!,
        num_coupons: couponsFromThisDonation,
      });
    }
  }

  const deduct = Math.min(remainingToDeductFromLogs, log.remaining_allocated_amount!);
  remainingToDeductFromLogs -= deduct;

  // Update the donation_allocation_log table
  const { data: updateAllocatedLogs, error: logUpdateError } = await supabase
    .from("donation_allocation_log")
    .update({ remaining_allocated_amount: log.remaining_allocated_amount! - deduct })
    .eq("program_id", log.program_id!)
    .eq("id", log.id!);

  if (logUpdateError) throw new Error(logUpdateError.message);
    }
    
    // for (const log of donationAllocationLog) {
    //   if (remainingCoupons <= 0) break;

    //   const couponsFromThisDonation = Math.min(
    //     remainingCoupons,
    //     Math.floor(log.remaining_allocated_amount! / subscriptionValue)
    //   );
    //   remainingCoupons -= couponsFromThisDonation;

    //   donationLinks.push({
    //     donation_id: log.donation?.donation_id!,
    //     num_coupons: couponsFromThisDonation,
    //   });
      
    //   const deduct = Math.min(remainingToDeductFromLogs, log.remaining_allocated_amount!);
    //   remainingToDeductFromLogs -= deduct;

    //   // Step 7 update the donation_allocation_log table with the deducted remaining amount
    //   const { data: updateAllocatedLogs, error: logUpdateError } = await supabase
    //     .from("donation_allocation_log")
    //     .update({remaining_allocated_amount: log.remaining_allocated_amount! - deduct  })
    //     .eq("program_id", log.program_id!)
    //     .eq("id", log.id!);
      
    //   if (logUpdateError) throw new Error(logUpdateError.message);
    // }

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
    const { data: insertCoupon, error: insertCouponError } = await supabase
      .from("coupons")
      .insert(finalData)
      .select()
      .single();
    
    if (insertCouponError) throw new Error(insertCouponError.message);

    {/*Linking coupon to donation*/ }
    for (const link of donationLinks) {
      if (link.num_coupons > 0) {
        const { error: linkError } = await supabase
          .from("coupon_donation_link")
          .insert({
            coupon_id: insertCoupon.coupon_id!,
            donation_id: link.donation_id,
            num_of_coupons: link.num_coupons
          });
        
        if (linkError)
          throw new Error("Failed to link coupon to donation");
      }
    }

    // Step 10: mapping student and coupon
    const { data: mappingCoupons, error: mappingError } = await supabase
      .from("coupon_user_mapping")
      .insert({ "user_id": student_id, "coupon_id": insertCoupon.coupon_id });
    
    if (mappingError) throw new Error(mappingError.message);

    // Step 11: Generate and store coupon codes
    await generateAndStoreCouponCodes(insertCoupon);
    
    revalidatePath('/dashboard', 'page');
    return { success: true , data: insertCoupon };


  } catch (error: any) {
    console.error(error.message);
    return { success: false, error: error.message };
  }
}



{/* Helper functions */ }

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
     
     console.log(data);
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