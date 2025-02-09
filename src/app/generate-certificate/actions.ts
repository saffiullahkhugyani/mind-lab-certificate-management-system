import { createClient } from "@/lib/supabase/server";

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