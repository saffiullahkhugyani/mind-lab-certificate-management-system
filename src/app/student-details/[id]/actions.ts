import { createClient } from "@/lib/supabase/server";
import { Tag } from "@/types/types";

export async function getStudentData(studentId: string) {
    const supabase = createClient()
    
    try { 
        const { data: studentDetail, error: studentDetailError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", studentId);
        
        if (studentDetailError) throw new Error(studentDetailError.message);
        
        const { data: certificateDetails, error: certificateDetailsError } = await supabase
            .from('certificate_v1_v2_mapping')
            .select("user_id, certificate_master!inner(*)")
            .eq("user_id", studentId);
        
        if (certificateDetailsError) throw new Error(certificateDetailsError.message);
        
        const certificateData = certificateDetails.map((certificate) => {
           
            const { user_id, certificate_master } = certificate;

            /// Safely handle the `tags` field
            const tags = Array.isArray(certificate_master.tags)
                ? (certificate_master.tags as Tag[]).map((tag) => ({
                    tag_name: tag!.tag_name ?? "",
                    hours: tag!.hours ?? 0,
                }))
                : []; // Fallback if `tags` is not an array

            return {
                user_id,
                ...certificate_master, // Spread all other properties from `certificate_master`
                tags, // Replace tags with the processed tags array
            };
           
        });


         {/* Student screen information details fetching */}
        const { data: studentInterest, error: studentInterestError } = await supabase
            .from("student_interest")
            .select()
            .in("user_email", studentDetail.map(s => s.email));
      
        if (studentInterestError) throw new Error(studentInterestError.message);
        
        // Count club interest
        // const clubInterestCount =
        //     studentInterest?.filter(
        //         (interest) =>
        //             interest.user_email === studentDetail.at(0)!.email && interest.club !== null
        //     ).length ?? 0;

    //   // Extract emails from studentList
    //     const studentEmails = new Set(studentDetail.map(student => student.email));

    //     // Filter studentInterest where user_email exists in studentList
    //     const filteredStudentInterest = studentInterest.filter(interest =>
    //         interest.user_email && studentEmails.has(interest.user_email)
    //     );

        const { data: certificateEarned, error: certificateEarnedError } = await supabase
            .from("program_certificate_student_mapping")
            .select("*, program_certificate!inner(*)")
            .eq("student_id", studentId);
      
        if (certificateEarnedError) throw new Error(certificateEarnedError.message);
        
        const { data: cdl, error: cdlError } = await supabase
            .from("coupon_donation_link")
            .select(`num_of_coupons, coupons!inner(program_id, start_date, 
                coupon_user_mapping!inner(user_id, profiles!inner(id,name, email))),
                 donation!inner(donation_id, sponsor!inner(name))`)
            .eq("coupons.coupon_user_mapping.user_id", studentId);

        console.log("Number of program Interest:", studentInterest.length)
        console.log("Number of earned certificates: ", certificateEarned.length)
        console.log("Number of enrolled programs: ", cdl?.length);

        console.log(cdlError);
        if (cdlError) throw new Error(cdlError.message);


        return {
            success: true, data: {
                studentList: studentDetail,
                certificateData: certificateData,
                studentInterest: studentInterest,
                certificateEarnedCount: certificateEarned.length,
                programEnrolledCount: cdl.length
            }
        };

    } catch (error: any) {
        console.log(error.message);
        return { success: false, error: error.message };
    }
    
}
