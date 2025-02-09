"use server"

import { createClient } from "@/lib/supabase/server";
import {  ProgramCertificate } from "@/types/types";
import { revalidatePath } from "next/cache";

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


export async function getClubs() {
  const supabase = createClient();

  try {
    
    const { data: clubList, error: clubListError } = await supabase
      .from("clubs")
      .select("*");
    
    if (clubListError) throw new Error(clubListError.message);
    


    return { success: true, data: clubList };


   } catch (error: any) {
    return { success: false, error: error.message };
  }
}


export async function getProgramsList() {
  const supabase = createClient();

  try {
    
    const { data: programList, error: programListError } = await supabase
      .from("programs")
      .select("*");
    
    if (programListError) throw new Error(programListError.message);
    


    return { success: true, data: programList };


   } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addProgramCertificate(formData: ProgramCertificate) {
console.log("formData: ", formData);
  try {
    const supabase = createClient();
    const { id, ...rest } = formData;
    const certificateData = id === null ? rest : formData;
  
    const { data: addProgramCertificate, error: addProgramCertificateError } = await supabase
      .from("program_certificate").insert(certificateData).select().single();
    
    if (addProgramCertificateError) throw new Error(addProgramCertificateError.message);

    console.log("data interted to certificate master: ", addProgramCertificate);
    revalidatePath("/generate-certificate");
    return { success: true, data: addProgramCertificate };

  
  } catch (error: any) {
    console.log("Error inserting data into certificate master: ", error)
    return { success: false, error: error.message };
  }
}
