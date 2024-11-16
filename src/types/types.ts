import { Profiles } from "./customs";


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