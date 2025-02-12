"use server";
import { createClient } from "@/lib/supabase/server";           
import { Profiles } from "@/types/customs";
import { Json } from "@/types/supabase";
import { ProgramCertificateMapping, Tag } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function getStudents() {
  try {
    const supabase = createClient();
  
    const { data: studentList, error: studentListError } = await supabase
        .from("profiles")
        .select()
        .order("name", { ascending: false });
    
    if (studentListError) throw new Error(studentListError.message);
      
      return { success: true, data: studentList };
  
  } catch (error: any) {
    console.log("Fetching student list error: ", error)
    return { success: false, error: error.message };
  }
}

export async function getProgramCertificates() {
  try {
    const supabase = createClient();
  
    const { data: programCertificateList, error: programCertificateListError } = await supabase
        .from("program_certificate")
        .select()
        .order("certificate_name_english", { ascending: false });
    
    if (programCertificateListError) throw new Error(programCertificateListError.message);
      
      const transformTags = (tags: Json): Tag[] => {
                  // Ensure 'tags' is an array before processing
                  if (!Array.isArray(tags)) return [];
              
                  return tags.map((tag: any) => ({
                    tag_name: tag.tag_name || null,
                    hours: typeof tag.hours === "number" ? tag.hours : null,
                  }));
                };
          
              const certificatesWithTransformedTags = programCertificateList!.map((cert) => ({
              ...cert, // Spread the rest of the properties unchanged
              tags: transformTags(cert.tags), // Only transform the tags field
              }));
    
    
    return { success: true, data: certificatesWithTransformedTags };
  
  } catch (error: any) {
    console.log("Fetching student list error: ", error)
    return { success: false, error: error.message };
  }
}

export async function assignStudentCertificate(data: ProgramCertificateMapping) {
  try {
    const supabase = createClient();

    const { data: existingMapping, error: existingMappingError } = await supabase
      .from("program_certificate_student_mapping")
      .select()
      .eq("student_id", data.student_id!)
      .eq("program_certificate_id", data.program_certificate_id!);
    
    if (existingMappingError) throw new Error(existingMappingError.message);
    if (existingMapping && existingMapping.length > 0) { 
      return { success: false, error: "Certificate already assigned to student" };
    }
  
    const { data: programCertificateMapping, error: programCertificateMappingError } = await supabase
      .from("program_certificate_student_mapping")
      .insert(data)
      .select();
    
    if (programCertificateMappingError) throw new Error(programCertificateMappingError.message);
      
      revalidatePath("/assign-program-certificate");
      return { success: true, data: programCertificateMapping };
  
  } catch (error: any) {
    console.log("Fetching student list error: ", error)
    return { success: false, error: error.message };
  }
}


export async function getAssignedProgramCertificate() {
  try {
    const supabase = createClient();

      const { data: assignedCertificateMapping, error: ssignedCertificateMappingError } = await supabase
        .from("program_certificate_student_mapping")
        .select("*, profiles!inner(*), program_certificate!inner(*)");
    
    if (ssignedCertificateMappingError) throw new Error(ssignedCertificateMappingError.message);
    console.log("here");
    if (assignedCertificateMapping && assignedCertificateMapping.length > 0) {
      const transformedData = assignedCertificateMapping.map((item) => {
        return {
          student_name: item.profiles.name,
          certificate_name: item.program_certificate.certificate_name_english,
          certificate_id: item.program_certificate.id,
          student_id: item.profiles.id,
          tags: Array.isArray(item.program_certificate.tags)
            ? (item.program_certificate.tags as Tag[]).map((tag: Tag) => ({
                tag_name: tag.tag_name,
                hours: tag.hours,
              }))
            : [],
          id: item.id
          
        };
      });
      console.log("Transformed Data: ", transformedData);
      
      return { success: true, data: transformedData };
    
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}



