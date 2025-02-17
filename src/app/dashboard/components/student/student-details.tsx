import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Profiles } from "@/types/customs";
import Image from "next/image";
import React from "react";
import DetailsCard from "./detail-card";
import { CertificateDetails } from "@/types/types";
import StudentPieChart from "./student-pie-chart";

interface StudentDetailsProps {
  student: Profiles;
  onBack: () => void;
  studentCertificate: CertificateDetails[] | null;
  clubInterest: number | null;
  programInterest: number | null;
  certificateEarned: number | null;
  rating: string | null;
  enrolledProgramCount: number | null;
  programNotCompletedCount: number | null;
}

export default function StudentDetails({
  student,
  onBack,
  studentCertificate,
  programInterest,
  clubInterest,
  certificateEarned,
  rating,
  enrolledProgramCount,
  programNotCompletedCount,
}: StudentDetailsProps) {
  const nationalityMap: Record<string, string> = {
    "4dd82bb4-964c-4b33-b857-b95b17507af0": "Brazil",
    "a2a0d09f-f00d-43ce-9465-59bb4da847c7": "Brazil",
    "993382f4-f490-45ed-b9b6-49142b385e17": "Pakistan",
    "6514d0e1-ff55-4296-b880-baa1b7b5bf76": "UAE",
  };

  return (
    <div className=" bg-white shadow-md rounded-md">
      <div className="flex items-center justify-between mb-4 p-4">
        <Button variant="ghost" onClick={onBack} className="font-bold text-lg">
          ← Back
        </Button>
      </div>
      <div className="grid grid-cols-3 p-4 space-x-2">
        <Card className=" col-span-1 max-w-md shadow-md border bg-slate-100">
          <CardHeader className="flex flex-col items-center p-4">
            <Avatar className="w-40 h-40 rounded-none border">
              <AvatarImage src={student?.profile_image_url!} alt="@shadcn" />
              <AvatarFallback className="font-bold text-5xl rounded-none bg-gray-300">
                {student?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="px-6 py-4 space-y-4">
            {/* Display Name */}
            <div>
              <Label className="text-sm font-semibold text-gray-600">
                Display Name
              </Label>
              <div className="mt-1 p-2 bg-gray-300 rounded-md text-sm text-gray-800">
                {student?.name || "N/A"}
              </div>
            </div>
            {/* Age Group and Nationality */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-600">
                  Age Group
                </Label>
                <div className="mt-1 p-2 bg-gray-300 rounded-md text-sm text-gray-800">
                  {student?.age || "N/A"}
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-600">
                  Nationality
                </Label>
                <div className="mt-1 p-2 bg-gray-300 rounded-md text-sm text-gray-800">
                  {nationalityMap[student.id] || "UAE"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-2">
          {studentCertificate?.length! > 0 ? (
            <StudentPieChart studentCertificate={studentCertificate} />
          ) : (
            <div className="flex items-center justify-center bg-slate-200 h-full border rounded shadow-sm text-3xl font-bold">
              No data yet
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-evenly p-4 ">
        <DetailsCard
          title="Program Interest"
          value={programInterest?.toString()!}
        />
        <DetailsCard title="Club Interest" value={clubInterest?.toString()!} />
        <DetailsCard
          title="Program Enrolled"
          value={enrolledProgramCount?.toString()!}
        />
        <DetailsCard
          title="Certificates Earned"
          value={certificateEarned?.toString()!}
        />
        <DetailsCard
          title="Program not completed"
          value={programNotCompletedCount?.toString()!}
        />
        <DetailsCard title="Rating" value={rating! ?? "N/A"} />
      </div>
    </div>
  );
}
