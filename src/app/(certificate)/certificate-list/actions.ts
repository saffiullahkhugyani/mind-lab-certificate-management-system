"use server"

import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/supabase";
import { Certificate, Tag } from "@/types/types";
import { revalidatePath } from "next/cache"

export async function switchCertificateState(certificateId: String, value: boolean) {
  const supabase = createClient();
  
  const certificateStatus = {certificate_status: value}
    
    const { data, error } = await supabase.from("certificate_master").
        update(certificateStatus).eq("id", certificateId).select();
    
    if (data != null)
  {

    console.log("Status changed: ",data);
  } else {
    console.log("Error changing status: ",error)
  }

  revalidatePath("/certificate-list")

  return data;

}

export async function getCertificateList() {

  try {
    const supabase = createClient();
    
    const { data: certificateMaster, error: certificateMasterError } = await supabase
      .from("certificate_master")
      .select()
      .order("id", { ascending: true });
    
    if (certificateMasterError) throw new Error(certificateMasterError.message);

    const transformTags = (tags: Json): Tag[] => {
            // Ensure 'tags' is an array before processing
            if (!Array.isArray(tags)) return [];
        
            return tags.map((tag: any) => ({
              tag_name: tag.tag_name || null,
              hours: typeof tag.hours === "number" ? tag.hours : null,
            }));
          };
    
        const certificatesWithTransformedTags = certificateMaster!.map((cert) => ({
        ...cert, // Spread the rest of the properties unchanged
        tags: transformTags(cert.tags), // Only transform the tags field
      }));

    return {success:true, data: certificatesWithTransformedTags};

   } catch (error: any) {
    return {success:false, error: error.message}
  }
  
}