import { Database } from "./supabase";

export type SkillType = Database['public']['Tables']['skill_types']['Row']
export type SkillTags = Database['public']['Tables']['tags']['Row']
export type Certificate = Database['public']['Tables']['certificate_master']['Row']
export type UploadedCertificate = Database['public']['Tables']['upload_certificate']['Row']
export type Profiles = Database['public']['Tables']['profiles']['Row']
export type Donation = Database['public']['Tables']['donation']['Row']
export type Sponsor = Database['public']['Tables']['sponsor']['Row']
export type Clubs = Database['public']['Tables']['clubs']['Row']
export type Coupons = Database['public']['Tables']['coupons']['Row']