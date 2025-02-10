import React from "react";
import { getProgramCertificates, getStudents } from "./actions";
import AssignStudentCertificateForm from "./components/assign-student-certificate-form";

export default async function Page() {
  const studentList = await getStudents();
  const progamCertficateList = await getProgramCertificates();
  return (
    <div className="container">
      <AssignStudentCertificateForm
        students={studentList.data!}
        programCertificates={progamCertficateList.data!}
      />
    </div>
  );
}
