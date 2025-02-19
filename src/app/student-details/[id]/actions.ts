import { createClient } from "@/lib/supabase/server";
import { StudentSupport, Tag } from "@/types/types";
import { addMonths } from "date-fns";

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

        // Count program interests (non-null program entries)
    const programInterestCount =
      studentInterest?.filter(
        (interest) =>
          interest.user_email === studentDetail.at(0)!.email && interest.program_id !== null
      ).length ?? 0;
        
        // Count club interest
        const clubInterestCount =
            studentInterest?.filter(
                (interest) =>
                    interest.user_email === studentDetail.at(0)!.email && interest.club_id !== null
            ).length ?? 0;

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

        // Get all earned certificates for the student that have a valid rating
        const studentCertificatesEarned =
            certificateEarned?.filter(
                (cert) =>
                    cert.student_id === studentId &&
                    cert.rating !== null &&
                    cert.rating !== undefined
            ) ?? [];
        
        
        // console.log(certificateEarned);
        // console.log(studentCertificatesEarned);

        const studentRating =
            studentCertificatesEarned!.length > 0
                ? studentCertificatesEarned!.reduce(
                    (sum, cert) => sum + (cert.rating ?? 0),
                    0
                ) / studentCertificatesEarned!.length
                : 0;
        
        const { data: cdl, error: cdlError } = await supabase
            .from("coupon_donation_link")
            .select(`num_of_coupons, coupons!inner(coupon_id, program_id, start_date, 
                coupon_user_mapping!inner(user_id, profiles!inner(id,name, email))),
                 donation!inner(donation_id, sponsor!inner(name))`)
            .eq("coupons.coupon_user_mapping.user_id", studentId);
            
        if (cdlError) throw new Error(cdlError.message);
        
        const supportList: StudentSupport[] = [];
        cdl!.forEach(mapping => {
            supportList.push({
                user_id: mapping.coupons.coupon_user_mapping.at(0)?.user_id!,
                coupon_id: mapping.coupons.coupon_id!,
                donation_id: mapping.donation.donation_id,
                program_id: mapping.coupons?.program_id ?? null,
                num_of_coupons: mapping.num_of_coupons,
                couponStartDate: mapping.coupons.start_date!,
            });
        });


        // Count programs not completed 
        const today = new Date();
        const programNotCompletedCount =
            supportList.filter((support) => {
                const { couponStartDate, num_of_coupons, program_id } = support;

                if (!couponStartDate || !num_of_coupons) return false; // Ensure data exists

                // Calculate program end date
                const startDate = new Date(couponStartDate);
                const programEndDate = addMonths(startDate, num_of_coupons);

                // Check if program period has ended
                const isProgramFinished = today > programEndDate;

                // Check if a certificate exists for this program
                const hasCertificate = certificateEarned?.some(
                    (cert) =>
                        cert.student_id === studentId &&
                        cert.program_certificate?.program_id === program_id
                );

                // console.log(
                //     isProgramFinished,
                //     " = ",
                //     startDate,
                //     today,
                //     " ",
                //     programEndDate
                // );

                
                // Program is not completed if period has ended but no certificate exists
                return isProgramFinished && !hasCertificate;
            }).length ?? 0;
        
        // console.log(supportList);

        // console.log("Number of program Interest:", studentInterest.length)
        // console.log("Number of earned certificates: ", certificateEarned.length)
        // console.log("Number of enrolled programs: ", cdl?.length);
        // console.log("Program Not Completed: ", programNotCompletedCount);
        // console.log("rating: ", studentRating);



        return {
            success: true, data: {
                studentList: studentDetail,
                certificateData: certificateData,
                programInterestCount: programInterestCount,
                clubInterestCount: clubInterestCount,
                certificateEarnedCount: certificateEarned.length,
                programEnrolledCount: cdl.length,
                programNotCompleted: programNotCompletedCount,
                studentRating: studentRating
            }
        };

    } catch (error: any) {
        console.log(error.message);
        return { success: false, error: error.message };
    }
    
}
