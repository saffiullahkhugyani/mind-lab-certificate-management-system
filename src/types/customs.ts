import { Database } from "./supabase";

export type SkillType = Database['public']['Tables']['skill_types']['Row']
export type SkillTags = Database['public']['Tables']['tags']['Row']
export type Certificate = Database['public']['Tables']['certificate_master']['Row']