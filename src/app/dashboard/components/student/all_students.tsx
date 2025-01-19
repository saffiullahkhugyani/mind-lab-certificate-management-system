"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import StudentCard from "./student-card";
import { Profiles } from "@/types/customs";
import StudentDetails from "./student-details";
import { StudentSupport } from "@/types/types";

interface StudentProps {
  students: Profiles[] | null;
}

export default function AllStudents({ students }: StudentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Profiles[] | null>(
    students
  );
  const [selectedStudent, setSelectedStudent] = useState<Profiles | null>(null);

  // Handle search students
  const handleOnChnage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();

    setSearchQuery(query);

    // Filter the students based on the search query
    const filter = students?.filter((student) =>
      student.name?.toLowerCase().includes(query)
    );

    setFilteredStudents(filter!);
  };

  // Handle Selected Students
  const hanldeSelectedStudent = function (student: Profiles) {
    setSelectedStudent(student);
  };

  // Handle Back to list
  const handleBackToList = function () {
    console.log(selectedStudent);
    setSelectedStudent(null);
  };

  return (
    <div className="bg-gray-50 shadow-md p-4 rounded-md space-x-2">
      {/* Search and Header */}
      {!selectedStudent && (
        <div className="flex items-center justify-between w-full p-2">
          <Label className="text-lg font-bold">Students</Label>
          <Input
            placeholder="Search for students"
            className="ml-auto w-[180px]"
            onChange={handleOnChnage}
          />
        </div>
      )}

      {!selectedStudent ? (
        filteredStudents?.length! > 0 ? (
          <div className="grid grid-cols-3">
            {filteredStudents?.map((student) => {
              return (
                <StudentCard
                  key={student.id}
                  student={student}
                  onClick={async () => hanldeSelectedStudent(student)}
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
        <StudentDetails student={selectedStudent!} onBack={handleBackToList} />
      )}
    </div>
  );
}
