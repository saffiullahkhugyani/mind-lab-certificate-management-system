import { readUserSession } from "@/lib/actions/action";
import { redirect } from "next/navigation";
import React from "react";
import CertificatePage from "./components/certificate-page";
import { createClient } from "@/lib/supabase/server";
import {
  getAssertedCertificatesList,
  getCertificateList,
  getSkillTags,
  getSkillTypes,
} from "./actions";

export default async function page() {
  const supabase = createClient();
  const { data: userSession } = await readUserSession();

  if (!userSession.session) {
    return redirect("/login");
  }

  // fetching skill type
  const skillTypes = await getSkillTypes();

  // fetching skill tags
  const skillTags = await getSkillTags();

  // fetching asserted certificates
  const uploadedCertificates = await getCertificateList();

  // fetching certificates uploaded by students
  const assertedCertificates = await getAssertedCertificatesList();

  return (
    <CertificatePage
      certificates={assertedCertificates.data!}
      skillTags={skillTags.data!}
      skillType={skillTypes.data!}
      uploadedCertificates={uploadedCertificates.data!}
    />
  );
}
