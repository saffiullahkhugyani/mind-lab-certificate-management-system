"use client";
import React, { useEffect, useState } from "react";
import { Profiles } from "@/types/customs";
import { CertificateDetails, Programs, StudentSupport } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentList from "./student_list";
import {
  addStudentSupport,
  assignStudentProgram,
  cancelStudentSupport,
} from "../../actions";
import { toast } from "@/components/ui/use-toast";

interface StudentProps {
  students: Profiles[] | null;
  supportedStudents: StudentSupport[] | null;
  certificateData: CertificateDetails[] | null;
  programs: Programs[] | null;
  sponsorId: number;
}

export default function StudentTabs({
  students,
  supportedStudents,
  certificateData,
  programs,
  sponsorId,
}: StudentProps) {
  const [notSupported, setNotSupported] = useState<Profiles[] | null>(students);
  const [supported, setStudentSupport] = useState<Profiles[] | null>(null);

  useEffect(() => {
    if (!students || !supportedStudents) {
      setStudentSupport(null);
      return;
    }

    // Create a Set of supported user IDs for efficient lookup
    const supportedUserIds = new Set(
      supportedStudents.map((item) => item.user_id)
    );

    // Filter students who are supported
    const supportedStudentsList = students.filter((student) =>
      supportedUserIds.has(student.id)
    );

    // Filter student those who are not supported
    const notSupported = students.filter(
      (student) => !supportedUserIds.has(student.id)
    );

    setNotSupported(notSupported.length > 0 ? notSupported : null);

    setStudentSupport(
      supportedStudentsList.length > 0 ? supportedStudentsList : null
    );
  }, [students, supportedStudents]);

  const handleCancelSupport = async (studentId: string) => {
    try {
      const res = await cancelStudentSupport(studentId, sponsorId, programs!);

      if (res.success) {
        toast({
          description: `Support cancelled for the student`,
          variant: "success",
        });
      }

      if (res.error) {
        toast({
          description: res.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        description: error,
        variant: "destructive",
      });
    }
  };

  const handleAssignProgram = async (studentId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`from handleAssignProgram ${studentId}`);
    await assignStudentProgram(studentId, sponsorId);
    // try {
    //   const res = await cancelStudentSupport(studentId, sponsorId, programs!);

    //   if (res.success) {
    //     toast({
    //       description: `Support cancelled for the student`,
    //       variant: "success",
    //     });
    //   }

    //   if (res.error) {
    //     toast({
    //       description: res.error,
    //       variant: "destructive",
    //     });
    //   }
    // } catch (error: any) {
    //   toast({
    //     description: error,
    //     variant: "destructive",
    //   });
    // }
  };

  return (
    <div>
      <Tabs defaultValue="all-students" className="w-full">
        <TabsList className="flex justify-start">
          <TabsTrigger value="all-students">All Students</TabsTrigger>
          <TabsTrigger value="supported-students">
            Supported Students
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-students">
          <div className="mt-4">
            <StudentList
              students={students}
              certificateData={certificateData}
              listType={"all"}
              supportedStudents={supportedStudents}
              onCancelSupport={handleCancelSupport}
              programs={programs}
              onAssignProgram={handleAssignProgram}
            />
          </div>
        </TabsContent>

        <TabsContent value="supported-students">
          <div className="mt-4">
            <StudentList
              students={supported}
              certificateData={certificateData}
              listType={"supported"}
              supportedStudents={supportedStudents}
              onCancelSupport={handleCancelSupport}
              programs={programs}
              onAssignProgram={handleAssignProgram}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
