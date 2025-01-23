"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import StudentCard from "./student-card";
import { Profiles } from "@/types/customs";
import StudentDetails from "./student-details";
import { CertificateDetails, StudentSupport } from "@/types/types";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import CancelSupportDialog from "./cancel_support_dialog";

interface StudentListProps {
  students: Profiles[] | null;
  certificateData: CertificateDetails[] | null;
  onCancelSupport: (studentId: string) => Promise<void>;
  listType: "all" | "supported";
}

export default function StudentList({
  students,
  certificateData,
  onCancelSupport,
  listType,
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
    console.log(studentId);
    const cancelStudent = students?.find((student) => student.id === studentId);
    setSelectedStudent(cancelStudent!);
    console.log(cancelStudent);
    setIsDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    console.log(selectedStudent);
    if (!onCancelSupport || !selectedStudent) return;

    try {
      setIsProcessing(true);
      await onCancelSupport(selectedStudent.id);

      const updatedStudents =
        filteredStudents?.filter(
          (student) => student.id !== selectedStudent.id
        ) || null;

      setFilteredStudents(updatedStudents);
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
      />
      {/* <ResponsiveDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title="Cancel Support"
        description="Are you sure you want to cancel support for this student?"
      >
        <div className="mt-6 space-y-4">
          <p>
            This action will remove {selectedStudent?.name} from your supported
            students list.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedStudent(null);
                setIsDialogOpen(false);
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Cancel Support"}
            </Button>
          </div>
        </div>
      </ResponsiveDialog> */}
    </div>
  );
}
