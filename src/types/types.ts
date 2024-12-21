


export type Certificate = {
  id: string | null,
  issue_year: string | null,
  issue_authority: string | null,
  certificate_name_arabic: string | null,
  certificate_name_english: string | null,
  certificate_country: string | null,
  number_of_hours: string | null,
  skill_level: string | null,
  skill_type: string | null,
  tags: string[] | null,
  certificate_status: boolean  | null,

}

export type SkillType = {
  id: string;
  skill_type_name: string;
}

export type FormattedSkillTags = {
  id: number | null;
  tag: string | null;
  skill_types: string | null;
}

export type CustomUploadedCertificate = {
  id: string
  certificate_image_url: string | null
  profiles: Profiles | null
}

export type Sponsors = {
    sponsor_id: number,
    user_id: string | null,
    name: string | null,
    email: string | null,
    phone_number: string | null
}

export type Donation = {
  amount?: number | null
  bank_charges?: number | null
  date?: string | null
  donation_description?: string | null
  donation_id?: number
  remaining_amount?: number | null
  source_of_amount?: string | null
  sponsor_id: number
}

export type Programs = {
  club_id?: number | null
  period?: string | null
  program_arabic_name?: string | null
  program_english_name?: string | null
  program_id?: number
  subscription_value?: string | null
  total_allocated_donation?: number | null
  total_remaining_donation?: number | null
}

export type DonationAllocation = {
  amount: number | null
  created_at?: string
  program_id: number | null
}

export type Clubs = {
  club_name?: string | null
  club_id?: number
  created_at?: string
}

export type Profiles = {
  age?: string | null
  email?: string | null
  gender?: string | null
  id: string
  mobile?: string | null
  name?: string | null
  profile_image_url?: string | null
  updated_at?: string | null
}

export type Coupons = {
  club_id?: number | null
  coupon_duration?: string | null
  coupon_id?: number
  created_at?: string
  program_id?: number | null
  start_date?: string | null
  start_period?: string | null
  student_id?: string | null
  student_email?: string | null
  number_of_coupons?: number | null
}

export type StudentInterestData = {
  id?: number
  email?: string | null
  user_email?: string | null
  club_id?: number | null
  club?: string | null
  program_id?: number | null
  program?: string | null
  date_submitted?: string | null
  created_at?: string
}