import React from "react";
import {
  getAssignedProgramCertificate,
  getProgramCertificates,
  getStudents,
} from "./actions";
import AssignStudentCertificateForm from "./components/assign-student-certificate-form";
import Certificate from "./components/certificate";
import CertificateList from "./components/certificates-list";

export default async function Page() {
  const studentList = await getStudents();
  const progamCertficateList = await getProgramCertificates();
  const assignProgramCertificate = await getAssignedProgramCertificate();

  // console.log("Program Certificate List: ", progamCertficateList);
  return (
    <>
      <div className="container">
        <AssignStudentCertificateForm
          students={studentList.data!}
          programCertificates={progamCertficateList.data!}
        />
      </div>

      <div className="container">
        <CertificateList
          assignedCertificate={assignProgramCertificate?.data!}
        />
        {/* <Certificate /> */}
      </div>
    </>
  );
}
