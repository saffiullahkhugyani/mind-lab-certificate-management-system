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
import { Label } from "@/components/ui/label";

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
    console.log(`from handleAssignProgram ${studentId}`);
    try {
      const res = await assignStudentProgram(studentId, sponsorId);
      console.log(res);

      if (res.success) {
        toast({
          description: res.data,
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

  return (
    <div className="bg-white shadow-md p-4 rounded-md space-x-2 space-y-4">
      <Tabs defaultValue="all-students" className="w-full">
        <TabsList
          className="flex justify-start"
          variant={"underline"}
          width={"fit"}
        >
          <TabsTrigger value="all-students" variant={"underline"}>
            All Students
          </TabsTrigger>
          <TabsTrigger value="supported-students" variant={"underline"}>
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
