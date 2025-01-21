"use server"

import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/supabase";
import { Certificate, Tag } from "@/types/types";
import { revalidatePath } from "next/cache";


export async function getCertificateList() {

  try {
    const supabase = createClient();
    
    const { data: uploadedCertificates, error: uploadedCertificatesError } = await supabase
      .from("upload_certificate")
      .select(`id, certificate_image_url ,profiles(*)`)
      .match({ certificate_asserted: "0" });
    
    if (uploadedCertificatesError) throw new Error(uploadedCertificatesError.message);

    return {success:true, data: uploadedCertificates};

   } catch (error: any) {
    return {success:false, error: error.message}
  }
  
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

export async function getSkillCatrgories() {
  try {
    const supabase = createClient();

    const { data: skillCategory, error: skillCategoryError } = await supabase
      .from("skill_category")
      .select("*");
    
    if (skillCategoryError) throw new Error(skillCategoryError.message);

    return { success: true, data: skillCategory };


   } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSkillTypes() {
  try {
    const supabase = createClient();

    const { data: skillTypes, error: skillTypeError } = await supabase
      .from("skill_types")
      .select("*");
    
    if (skillTypeError) throw new Error(skillTypeError.message);

    return { success: true, data: skillTypes };


   } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSkillTags() {
  const supabase = createClient();

  try {
    
    const { data: skillTags, error: skillTagsError } = await supabase
      .from("skill_tags")
      .select("*");
    
    if (skillTagsError) throw new Error(skillTagsError.message);
    


    return { success: true, data: skillTags };


   } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addCertificate(formData: Certificate) {

  try {
    const supabase = createClient();
    const { id, ...rest } = formData;
    const certificateData = id === null ? rest : formData;
  
    const { data: addCertificate, error: addCertificateError } = await supabase
      .from("certificate_master").insert(certificateData).select().single();
    
    if (addCertificateError) throw new Error(addCertificateError.message);

    console.log("data interted to certificate master: ", addCertificate);
    revalidatePath("/create-certificate");
    return { success: true, data: addCertificate };

  
  } catch (error: any) {
    console.log("Error inserting data into certificate master: ", error)
    return { success: false, error: error.message };
  }
}

export async function updateCertificate(formData: Certificate) {

  try {
    const supabase = createClient();
    const { id, ...rest } = formData;
    const certificateData = id === null ? rest : formData;
      
    const { data: updateCertificate, error: updateCertificateError } = await supabase.from("certificate_master").update(certificateData).eq("id", formData.id!).select();

    if (updateCertificateError) throw new Error(updateCertificateError.message);
    
    console.log("data updated to certificate master: ", updateCertificate);
    revalidatePath("/create-certificate")
    return { success: true, data: updateCertificate };
    
    
  } catch (error: any) { 
    console.log("Error updating data into certificate master: ", error)
    return { success: false, error: error.message };
  }

}

export async function addCertificateMapping({ userId, certificateV1Id, certificateV2Id }:
  { userId: string, certificateV1Id: string, certificateV2Id: string }) {
  console.log("User Id: ", userId);
  console.log("V1 Id: ", certificateV1Id);
  console.log("V2 Id:", certificateV2Id);
    try { 
    
      const supabase = createClient();
      const { data: addCertificateMapping, error: certificateMappingError } = await supabase
        .from("certificate_v1_v2_mapping")
        .insert({ user_id: userId, v1_certificate_id: certificateV1Id, v2_certificate_id: certificateV2Id }).select();
         
      if (certificateMappingError) throw new Error(certificateMappingError.message);
      
      
      console.log("Data inserted into v1 and v2 mapping: " , addCertificateMapping);
      revalidatePath("/create-certificate");
      return { success: true, data: addCertificateMapping };
    
  
    } catch (error: any) {
      console.log("Error mapping certificate version 1 and version 2: ", error);
      return { success: false, error: error.message };
    }
  
}

export async function certificateAsserted({ certificateV1Id }: { certificateV1Id: string }) {
  
  try { 
    const supabase = createClient();
    const { data: assertedCertificate, error: assertedCertificateError } = await supabase
      .from("upload_certificate")
      .update({ certificate_asserted: "1" })
      .eq("id", certificateV1Id)
      .select();
    
    // throw error if any error
    if (assertedCertificateError) throw new Error(assertedCertificateError.message);

    // return success with data if asserted 
    console.log("Certificate Asserted: ", assertedCertificate);
    revalidatePath("/create-certificate");
    return { success: true, data: assertedCertificate };
    
  } catch (error: any) {
    console.log("Certificaete Assertion error: ", error);
    return { success: false, error: error.message };
    
  }
}
