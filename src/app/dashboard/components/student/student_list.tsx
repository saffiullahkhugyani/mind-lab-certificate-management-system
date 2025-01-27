"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import StudentCard from "./student-card";
import { Profiles } from "@/types/customs";
import StudentDetails from "./student-details";
import { CertificateDetails, Programs, StudentSupport } from "@/types/types";
import CancelSupportDialog from "./cancel_support_dialog";

interface StudentListProps {
  students: Profiles[] | null;
  certificateData: CertificateDetails[] | null;
  supportedStudents: StudentSupport[] | null;
  programs: Programs[] | null;
  onCancelSupport: (studentId: string, programId: number) => void;
  listType: "all" | "supported";
}

export default function StudentList({
  students,
  certificateData,
  onCancelSupport,
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

  const handleOpenCancelDialog = (studentId: string) => {
    // console.log(studentId);
    const cancelStudent = students?.find((student) => student.id === studentId);
    setSelectedStudent(cancelStudent!);
    // console.log(cancelStudent);
    setIsDialogOpen(true);
  };

  const handleConfirmCancel = async (programId: number) => {
    if (!onCancelSupport || !selectedStudent) return;
    try {
      setIsProcessing(true);
      await onCancelSupport(selectedStudent.id, programId);
      setIsDialogOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error("Error canceling support:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-50 shadow-md p-4 rounded-md space-x-2">
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
            {filteredStudents?.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onClick={async () => handleSelectedStudent(student)}
                onCancelSupportClick={handleOpenCancelDialog}
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
      <CancelSupportDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        selectedStudent={selectedStudent}
        onConfirmCancel={handleConfirmCancel}
        isProcessing={isProcessing}
        selectedStudentPrograms={selectedStudentPrograms!}
      />
    </div>
  );
}
