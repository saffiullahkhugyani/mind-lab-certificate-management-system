import React from "react";
import GenerateCertificate from "./components/generate-certificate";
import {
  getClubs,
  getProgramsList,
  getSkillCatrgories,
  getSkillTags,
  getSkillTypes,
} from "./actions";

export default async function page() {
  // fetching skill categories
  const skillCategory = await getSkillCatrgories();

  // fetching skill type
  const skillTypes = await getSkillTypes();

  // fetching skill tags
  const skillTags = await getSkillTags();

  // fetching skill tags
  const clubList = await getClubs();

  // fetching skill tags
  const ProgramList = await getProgramsList();

  return (
    <div className="container">
      <GenerateCertificate
        skillCategory={skillCategory.data!}
        skillType={skillTypes.data!}
        skillTags={skillTags.data!}
        clubList={clubList.data!}
        programList={ProgramList.data!}
      />
    </div>
  );
}
