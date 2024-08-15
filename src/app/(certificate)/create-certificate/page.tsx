import { readUserSession } from "@/lib/actions/action";
import { redirect } from "next/navigation";
import React from "react";
import CertificatePage from "./components/certificate-page";
import { createClient } from "@/lib/supabase/server";
export default async function () {
  const supabase = await createClient();
  const { data: userSession } = await readUserSession();

  if (!userSession.session) {
    return redirect("/login");
  }

  const { data: certificateList } = await supabase
    .from("certificate_master")
    .select();
  const { data: skillType } = await supabase.from("skill_types").select();
  const { data: skillTags } = await supabase
    .from("tags")
    .select(`id, tag, skill_types(skill_type_name)`);

  const formattedSkillTags = skillTags!.map((tag) => ({
    id: tag.id,
    tag: tag.tag,
    skill_types: tag.skill_types!.skill_type_name, // Extract skill_type_name to skill_types
  }));

  return (
    <CertificatePage
      certificates={certificateList}
      skillTags={formattedSkillTags}
      skillType={skillType!}
    />
  );
}
