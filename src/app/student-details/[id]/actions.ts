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
                studentList: studentDetail,
                certificateData: certificateData
            }
        };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
    
}
