"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import StudentCard from "./student-card";
import { Profiles } from "@/types/customs";
import StudentDetails from "./student-details";
import { CertificateDetails, StudentSupport } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllStudents from "./all_students";
import SupportedStudents from "./supported_students";

interface StudentProps {
  students: Profiles[] | null;
  supportedStudents: StudentSupport[] | null;
  certificateData: CertificateDetails[] | null;
}

export default function StudentTabs({
  students,
  supportedStudents,
  certificateData,
}: StudentProps) {
  const [filteredStudents, setFilteredStudents] = useState<Profiles[] | null>(
    students
  );
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

    setStudentSupport(
      supportedStudentsList.length > 0 ? supportedStudentsList : null
    );
  }, [students, supportedStudents]);

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
            <AllStudents
              students={students}
              certificateData={certificateData}
            />
          </div>
        </TabsContent>

        <TabsContent value="supported-students">
          <div className="mt-4">
            <SupportedStudents
              students={supported}
              certificateData={certificateData}
              supportedStudents={supportedStudents}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
