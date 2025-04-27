import StudentDetails from "./components/student-details";
import { getStudentData } from "./actions";

interface StudentDetailsPageProps {
  params: Promise<{ id: string }>;
}
export default async function Page({ params }: StudentDetailsPageProps) {
  const { id } = await params;

  const studentData = await getStudentData(id);
  return (
    <StudentDetails
      student={studentData.data?.studentList.at(0)!}
      certificateData={studentData.data?.certificateData!}
      programInterestCount={studentData.data?.programInterestCount!}
      clubInterestCount={studentData.data?.clubInterestCount!}
      programEnrolledCount={studentData.data?.programEnrolledCount!}
      certificateEarnedCount={studentData.data?.certificateEarnedCount!}
      programNotCompletedCount={studentData.data?.programNotCompleted!}
      rating={studentData.data?.studentRating!}
    />
  );
}
