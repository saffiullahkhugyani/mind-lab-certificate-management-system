import { readUserSession } from "@/lib/actions/action";
import { redirect } from "next/navigation";
import React from "react";
import CertificatePage from "./components/certificate-page";
import { createClient } from "@/lib/supabase/server";

async function getCertificateList() {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const supabase = createClient();
  const { data: uploadedCertificates } = await supabase
    .from("upload_certificate")
    .select(`id, certificate_image_url ,profiles(*)`)
    .match({ certificate_asserted: "0" });

  return uploadedCertificates;
}

export default async function page() {
  const supabase = createClient();
  const { data: userSession } = await readUserSession();

  if (!userSession.session) {
    return redirect("/login");
  }

  // fetching certificates uploaded by admin
  const { data: certificateList } = await supabase
    .from("certificate_master")
    .select()
    .eq("certificate_status", true);

  // fetching skill type and tags
  const { data: skillType } = await supabase.from("skill_types").select();
  const { data: skillTags } = await supabase
    .from("tags")
    .select(`id, tag, skill_types(skill_type_name)`);

  // foramtting skill tags
  const formattedSkillTags = skillTags!.map((tag) => ({
    id: tag.id,
    tag: tag.tag,
    skill_types: tag.skill_types!.skill_type_name, // Extract skill_type_name to skill_types
  }));

  // fetching certificates uploaded by students to  be asserted
  const uploadedCertificates = await getCertificateList();

  return (
    <CertificatePage
      certificates={certificateList}
      skillTags={formattedSkillTags}
      skillType={skillType!}
      uploadedCertificates={uploadedCertificates}
    />
  );
}
