import StudentDetails from "./components/student-details";
import { getStudentData } from "./actions";

const StudentId = "1f698458-55f0-49cd-ad3a-ecc64bf146c2";

export default async function Page({ params }: { params: { id: string } }) {
  const studentData = await getStudentData(params.id);
  return (
    <StudentDetails
      student={studentData.data?.studentList.at(0)!}
      certificateData={studentData.data?.certificateData!}
    />
  );
}
