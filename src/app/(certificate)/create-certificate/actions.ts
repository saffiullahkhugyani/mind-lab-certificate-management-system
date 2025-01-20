"use server"

import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/supabase";
import { Certificate, Tag } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function addCertificate(formData: Certificate) {
  const supabase = createClient();
   const { id, ...rest } = formData;
  const certificateData = id === null ? rest : formData;

  const { data, error } = await supabase.from("certificate_master").insert(certificateData).select();

  if (data != null)
  {

    console.log("data interted to certificate master: ",data);
  } else {
    console.log("Error inserting data into certificate master: ",error)
  }

  revalidatePath("/create-certificate")

  return data;

}
// fetching certificates added by admin
export async function getAssertedCertificatesList() {
  try {
    const supabase = createClient();
    
    const { data: assertedCertificates, error: assertedCertificateError } = await supabase
      .from("certificate_master")
      .select()
      .eq("certificate_status", true);
    
    if (assertedCertificateError) throw new Error(assertedCertificateError.message);

     const transformTags = (tags: Json): Tag[] => {
        // Ensure 'tags' is an array before processing
        if (!Array.isArray(tags)) return [];
    
        return tags.map((tag: any) => ({
          tag_name: tag.tag_name || null,
          hours: typeof tag.hours === "number" ? tag.hours : null,
        }));
      };

    const certificatesWithTransformedTags = assertedCertificates!.map((cert) => ({
    ...cert, // Spread the rest of the properties unchanged
    tags: transformTags(cert.tags), // Only transform the tags field
  }));

    return {success:true, data: certificatesWithTransformedTags};

   } catch (error: any) {
    return {success:false, error: error.message}
  }
}


export async function updateCertificate(formData: Certificate) {
  const supabase = createClient();
   const { id, ...rest } = formData;
  const certificateData = id === null ? rest : formData;

  const { data, error } = await supabase.from("certificate_master").update(certificateData).eq("id", formData.id!).select();

  if (data != null)
  {

    console.log("data updated to certificate master: ",data);
  } else {
    console.log("Error updating data into certificate master: ",error)
  }

  revalidatePath("/create-certificate")

  return data;

}

export async function addCertificateMapping({userId, certificateV1Id, certificateV2Id}: {userId: string, certificateV1Id: string, certificateV2Id: string}) {
  const supabase = createClient();

  const { data, error } = await supabase.from("certificate_v1_v2_mapping")
    .insert({ user_id: userId ,v1_certificate_id: certificateV1Id, v2_certificate_id: certificateV2Id }).select();

  if (data != null) {
    console.log("Data inserted into v1 and v2 mapping: " , data);
  } else {
    console.log("Error inserting data into v1 and v2 mapping: ", error);
    }
  
  revalidatePath("/create-certificate")

  return data;
}

export async function certificateAsserted({ certificateV1Id }: { certificateV1Id: string }) {

  const supabase = createClient();

  const { data, error } = await supabase.from("upload_certificate").update({ certificate_asserted: "1" }).eq("id", certificateV1Id).select();
  

  if (data != null) {
    console.log("Certificate Asserted: " , data);
  } else {
    console.log("Certificaete Assertion error: ", error);
  }
  
  return data;
}
