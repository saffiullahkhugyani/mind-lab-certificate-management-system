"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import StudentCard from "./student-card";
import { Profiles } from "@/types/customs";
import StudentDetails from "./student-details";
import {
  AllocatedProgramData,
  CertificateDetails,
  ProgramCertificateStudentMapping,
  Programs,
  Student,
  StudentInterestData,
  StudentSupport,
} from "@/types/types";
import { addMonths } from "date-fns";
import AllocateProgramDialog from "./allocate-program-dialog";

interface StudentListProps {
  students: Student[] | null;
  certificateData: CertificateDetails[] | null;
  supportedStudents: StudentSupport[] | null;
  programs: Programs[] | null;
  allocatedProgramData: AllocatedProgramData[] | null;
  onCancelSupport: (studentId: string) => Promise<void>;
  onAssignProgram: (programId: number, studentId: string) => Promise<void>;
  listType: "all" | "supported";
  studentInterest: StudentInterestData[] | null;
  certificateEarned: ProgramCertificateStudentMapping[] | null;
}

interface SelectedStudentData {
  student: Student;
  programInterestCount: number;
  clubInterestCount: number;
  certificatesEarnedCount: number;
  rating: number;
  enrolledProgramsCount: number;
  programsNotCompleted: number;
}

export default function StudentList({
  students,
  certificateData,
  onCancelSupport,
  onAssignProgram,
  listType,
  supportedStudents,
  programs,
  allocatedProgramData,
  studentInterest,
  certificateEarned,
}: StudentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[] | null>(
    students
  );
  const [selectedStudent, setSelectedStudent] =
    useState<SelectedStudentData | null>(null);

  const [studentCertificates, setStudentCertificates] = useState<
    CertificateDetails[] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStudentPrograms, setSelectedStudentPrograms] = useState<
    Programs[] | null
  >();
  const [activeAction, setActiveAction] = useState<"cancel" | "assign" | null>(
    null
  );
  const [selectAssigningStudent, setSelectAssigningStudent] =
    useState<Student | null>(null);

  // console.log(supportedStudents);
  useEffect(() => {
    const studentSupport = supportedStudents?.filter((support) => {
      return support.student_id === selectedStudent?.student.id;
    });

    const filteredPrograms = programs?.filter((program) => {
      return studentSupport?.some((support) => {
        return support.program_id === program.program_id;
      });
    });

    // console.log(selectedStudentPrograms);
    setSelectedStudentPrograms(filteredPrograms);
  }, [selectedStudent, setSelectedStudent]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filter = students?.filter((student) => {
      const nameMatches = student.name?.toLowerCase().includes(query);
      const idMatches = student.id?.toLowerCase().includes(query);
      return nameMatches || idMatches;
    });

    setFilteredStudents(filter ?? []); // safer fallback
  };

  const handleSelectedStudent = function (student: Student) {
    // get student certificates
    const studentCertificate = certificateData?.filter((item) => {
      if (item.student_id === student.id) return item;
    });

    // Count program interests (non-null program entries)
    const programInterestCount =
      studentInterest?.filter(
        (interest) =>
          interest.user_email === student.email && interest.program !== null
      ).length ?? 0;

    // Count club interests (non-null club entries)
    const clubInterestCount =
      studentInterest?.filter(
        (interest) =>
          interest.user_email === student.email && interest.club !== null
      ).length ?? 0;

    // Count certificates earned
    const certificatesEarnedCount =
      certificateEarned?.filter(
        (cert) =>
          cert.student_id === student.id && cert.completion_status === true
      ).length ?? 0;

    // Get all earned certificates for the student that have a valid rating
    const studentCertificatesEarned =
      certificateEarned?.filter(
        (cert) =>
          cert.student_id === student.id &&
          cert.rating !== null &&
          cert.rating !== undefined
      ) ?? [];

    // Extract rating from the selected certificate
    // Compute the average rating
    const studentRating =
      studentCertificatesEarned!.length > 0
        ? studentCertificatesEarned!.reduce(
            (sum, cert) => sum + (cert.rating ?? 0),
            0
          ) / studentCertificatesEarned!.length
        : null; // Return null if no rating exists

    // Get enrolled programs count (same logic from StudentCard)
    const studentSupport = supportedStudents?.filter(
      (support) => support.student_id === student.id
    );

    const enrolledProgramsCount = new Set(
      studentSupport?.map((support) => support.program_id)
    ).size;

    // Count programs that are not completed
    const programNotCompletedCount =
      certificateEarned?.filter(
        (cert) =>
          cert.student_id === student.id && cert.completion_status === false
      ).length ?? 0;
    // const today = new Date();
    // const programsNotCompleted =
    //   studentSupport?.filter((support) => {
    //     const { couponStartDate, num_of_coupons, program_id } = support;

    //     if (!couponStartDate || !num_of_coupons) return false; // Ensure data exists

    //     // Calculate program end date
    //     const startDate = new Date(couponStartDate);
    //     const programEndDate = addMonths(startDate, num_of_coupons);
    //     // programEndDate.setDate(programEndDate.getDate() + num_of_coupons);

    //     // Check if program period has ended
    //     const isProgramFinished = today > programEndDate;

    //     // Check if a certificate exists for this program
    //     const hasCertificate = certificateEarned?.some(
    //       (cert) =>
    //         cert.student_id === student.id &&
    //         cert.program_certificate?.program_id === program_id
    //     );

    //     console.log(
    //       isProgramFinished,
    //       " = ",
    //       startDate,
    //       today,
    //       " ",
    //       programEndDate
    //     );

    //     // Program is not completed if period has ended but no certificate exists
    //     return isProgramFinished && !hasCertificate;
    //   }).length ?? 0;

    setStudentCertificates(studentCertificate!);
    setSelectedStudent({
      student,
      programInterestCount,
      clubInterestCount,
      certificatesEarnedCount,
      rating: studentRating!,
      enrolledProgramsCount,
      programsNotCompleted: programNotCompletedCount,
    });
  };

  const handleBackToList = function () {
    setSelectedStudent(null);
  };

  // const handleOpenCancelDialog = (studentId: string) => {
  //   // console.log(studentId);
  //   const cancelStudent = students?.find((student) => student.id === studentId);
  //   setSelectedStudent(cancelStudent!);
  //   // console.log(cancelStudent);
  //   setIsDialogOpen(true);
  // };

  // const handleConfirmCancel = async (programId: number) => {
  //   if (!onCancelSupport || !selectedStudent) return;
  //   try {
  //     setIsProcessing(true);
  //     await onCancelSupport(selectedStudent.id, programId);
  //     setIsDialogOpen(false);
  //     setSelectedStudent(null);
  //   } catch (error) {
  //     console.error("Error canceling support:", error);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const handleConfirmAllocateProgram = async (
    programId: number,
    studentId: string
  ) => {
    try {
      setActiveAction("assign");
      setIsProcessing(true);
      await onAssignProgram(programId, studentId);
    } catch (error) {
      console.error("Error canceling support:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onCancelSupportClick = async (studentId: string) => {
    try {
      setActiveAction("cancel");
      setIsProcessing(true);
      await onCancelSupport(studentId);
      // console.log(studentId);
      // const cancelStudent = students?.find(
      //   (student) => student.id === studentId
      // );
      // setSelectedStudent(cancelStudent!);
      // console.log(cancelStudent);
      // setSelectedStudent(null);
    } catch (error) {
      console.error("Error canceling support:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onAssignProgramClick = (studentId: string) => {
    try {
      const student = students?.find((student) => student.id === studentId);
      setSelectAssigningStudent(student!);
      setActiveAction("assign");
      setIsProcessing(true);
      setIsDialogOpen(true);
      // for FIFO logic assigning student to program directly
      // await onAssignProgram(studentId);
    } catch (error) {
      console.error("Error canceling support:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isProcessing && activeAction === "cancel" && (
        <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
            <p className="text-lg font-semibold mt-4">
              {activeAction === "cancel"
                ? "Canceling support..."
                : activeAction === "assign"
                ? "Assigning program to student..."
                : ""}
            </p>
          </div>
        </div>
      )}

      <div className="">
        {!selectedStudent && (
          <div className="flex items-center justify-between w-full p-2">
            <Label className="text-lg font-bold">Students</Label>
            <Input
              placeholder="Search for students"
              className="ml-auto w-[180px]"
              onChange={handleOnChange}
              value={searchQuery}
            />
          </div>
        )}

        {!selectedStudent ? (
          filteredStudents?.length! > 0 ? (
            <div className="grid grid-cols-3">
              {filteredStudents!.map((student) => {
                // Get all support records for this student
                const studentSupport = supportedStudents?.filter(
                  (support) => support.student_id === student.id
                );

                // Calculate total number of coupons
                const totalCoupons =
                  studentSupport?.reduce(
                    (sum, support) => sum + support.num_of_coupons!,
                    0
                  ) || 0;

                // Count unique enrolled programs
                const enrolledPrograms = new Set(
                  studentSupport?.map((support) => support.program_id)
                ).size;

                return (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onClick={async () => handleSelectedStudent(student)}
                    onCancelSupportClick={onCancelSupportClick}
                    onAssignProgram={onAssignProgramClick}
                    totalNumOfCoupons={totalCoupons}
                    totalNumOfEnrolledPrograms={enrolledPrograms}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex justify-center p-5 font-bold text-xl">
              No students found
            </div>
          )
        ) : (
          <StudentDetails
            student={selectedStudent.student}
            onBack={handleBackToList}
            studentCertificate={studentCertificates}
            clubInterest={selectedStudent.clubInterestCount}
            programInterest={selectedStudent.programInterestCount}
            certificateEarned={selectedStudent.certificatesEarnedCount}
            rating={selectedStudent.rating}
            enrolledProgramCount={selectedStudent.enrolledProgramsCount}
            programNotCompletedCount={selectedStudent.programsNotCompleted}
          />
        )}
        {isDialogOpen && (
          <AllocateProgramDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            selectedStudent={selectAssigningStudent}
            onConfirmAllocate={handleConfirmAllocateProgram} // Replace with your allocation logic
            isProcessing={isProcessing}
            availablePrograms={allocatedProgramData}
          />
        )}
        {/* <CancelSupportDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        selectedStudent={selectedStudent}
        onConfirmCancel={handleConfirmCancel}
        isProcessing={isProcessing}
        selectedStudentPrograms={selectedStudentPrograms!}
        /> */}
      </div>
    </>
  );
}
