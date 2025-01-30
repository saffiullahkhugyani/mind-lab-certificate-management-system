"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import StudentCard from "./student-card";
import { Profiles } from "@/types/customs";
import StudentDetails from "./student-details";
import { CertificateDetails, Programs, StudentSupport } from "@/types/types";

interface StudentListProps {
  students: Profiles[] | null;
  certificateData: CertificateDetails[] | null;
  supportedStudents: StudentSupport[] | null;
  programs: Programs[] | null;
  onCancelSupport: (studentId: string) => Promise<void>;
  onAssignProgram: (studentId: string) => Promise<void>;
  listType: "all" | "supported";
}

export default function StudentList({
  students,
  certificateData,
  onCancelSupport,
  onAssignProgram,
  listType,
  supportedStudents,
  programs,
}: StudentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Profiles[] | null>(
    students
  );
  const [selectedStudent, setSelectedStudent] = useState<Profiles | null>(null);
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
      return support.user_id === selectedStudent?.id;
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
    const studentCertificate = certificateData?.filter((item) => {
      if (item.user_id === student.id) return item;
    });
    setStudentCertificates(studentCertificate!);
    setSelectedStudent(student);
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
              {filteredStudents!.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onClick={async () => handleSelectedStudent(student)}
                  onCancelSupportClick={onCancelSupportClick}
                  onAssignProgram={onAssignProgramClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center p-5 font-bold text-xl">
              No students found
            </div>
          )
        ) : (
          <StudentDetails
            student={selectedStudent}
            onBack={handleBackToList}
            studentCertificate={studentCertificates}
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
