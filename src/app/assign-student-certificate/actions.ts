import { createClient } from "@/lib/supabase/server";
import { Profiles } from "@/types/customs";
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
        .order("name", { ascending: false });
    
    if (programCertificateListError) throw new Error(programCertificateListError.message);
      
      return { success: true, data: programCertificateList };
  
  } catch (error: any) {
    console.log("Fetching student list error: ", error)
    return { success: false, error: error.message };
  }
}

export async function assignProgramCertificateToStudent() {
  try {
    const supabase = createClient();
  
    const { data: programCertificateList, error: programCertificateListError } = await supabase
        .from("program_certificate")
        .select()
        .order("name", { ascending: false });
    
    if (programCertificateListError) throw new Error(programCertificateListError.message);
      
      return { success: true, data: programCertificateList };
  
  } catch (error: any) {
    console.log("Fetching student list error: ", error)
    return { success: false, error: error.message };
  }
}

