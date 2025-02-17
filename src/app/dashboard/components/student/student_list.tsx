"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import StudentCard from "./student-card";
import { Profiles } from "@/types/customs";
import StudentDetails from "./student-details";
import {
  CertificateDetails,
  ProgramCertificateStudentMapping,
  Programs,
  StudentInterestData,
  StudentSupport,
} from "@/types/types";

interface StudentListProps {
  students: Profiles[] | null;
  certificateData: CertificateDetails[] | null;
  supportedStudents: StudentSupport[] | null;
  programs: Programs[] | null;
  onCancelSupport: (studentId: string) => Promise<void>;
  onAssignProgram: (studentId: string) => Promise<void>;
  listType: "all" | "supported";
  studentInterest: StudentInterestData[] | null;
  certificateEarned: ProgramCertificateStudentMapping[] | null;
}

interface SelectedStudentData {
  student: Profiles;
  programInterestCount: number;
  clubInterestCount: number;
  certificatesEarnedCount: number;
  rating: string;
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
  studentInterest,
  certificateEarned,
}: StudentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Profiles[] | null>(
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

  // console.log(supportedStudents);
  useEffect(() => {
    const studentSupport = supportedStudents?.filter((support) => {
      return support.user_id === selectedStudent?.student.id;
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
    const filter = students?.filter((student) =>
      student.name?.toLowerCase().includes(query)
    );
    setFilteredStudents(filter!);
  };

  const handleSelectedStudent = function (student: Profiles) {
    // get student certificates
    const studentCertificate = certificateData?.filter((item) => {
      if (item.user_id === student.id) return item;
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
      certificateEarned?.filter((cert) => cert.student_id === student.id)
        .length ?? 0;

    // Get the latest certificate or a specific one
    const studentCertificateEarned = certificateEarned
      ?.filter((cert) => cert.student_id === student.id)
      ?.sort(
        (a, b) =>
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      ) // Sort by latest date
      ?.at(0); // Pick the most recent certificate

    // Extract rating from the selected certificate
    const studentRating = studentCertificateEarned?.rating ?? null;

    // Get enrolled programs count (same logic from StudentCard)
    const studentSupport = supportedStudents?.filter(
      (support) => support.user_id === student.id
    );

    const enrolledProgramsCount = new Set(
      studentSupport?.map((support) => support.program_id)
    ).size;

    // Count programs that are not completed
    const today = new Date();
    const programsNotCompleted =
      studentSupport?.filter((support) => {
        const { couponStartDate, num_of_coupons, program_id } = support;

        if (!couponStartDate || !num_of_coupons) return false; // Ensure data exists

        // Calculate program end date
        const startDate = new Date(couponStartDate);
        const programEndDate = new Date(startDate);
        programEndDate.setDate(programEndDate.getDate() + num_of_coupons - 1);

        // Check if program period has ended
        const isProgramFinished = today > programEndDate;

        // Check if a certificate exists for this program
        const hasCertificate = certificateEarned?.some(
          (cert) =>
            cert.student_id === student.id &&
            cert.program_certificate?.program_id === program_id
        );

        // Program is not completed if period has ended but no certificate exists
        return isProgramFinished && !hasCertificate;
      }).length ?? 0;

    setStudentCertificates(studentCertificate!);
    setSelectedStudent({
      student,
      programInterestCount,
      clubInterestCount,
      certificatesEarnedCount,
      rating: studentRating!,
      enrolledProgramsCount,
      programsNotCompleted,
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

  const onAssignProgramClick = async (studentId: string) => {
    try {
      setActiveAction("assign");
      setIsProcessing(true);
      await onAssignProgram(studentId);
    } catch (error) {
      console.error("Error canceling support:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isProcessing && (
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
                  (support) => support.user_id === student.id
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
