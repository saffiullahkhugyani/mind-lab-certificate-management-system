"use server"

import { createClient } from "@/lib/supabase/server"
import { AllocatedProgramData, Programs, StudentSupport, Tag } from "@/types/types";

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
        }

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
      throw new Error("support already exists.");
    }

  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}