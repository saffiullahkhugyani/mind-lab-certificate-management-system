import React from "react";
import StudentPieChart from "./student-pie-chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CertificateDetails, Profiles } from "@/types/types";
import { Label } from "@/components/ui/label";
import StudentDetailCard from "./student-datacard";

interface StudentDetailProps {
  student: Profiles | null;
  certificateData: CertificateDetails[] | null;
}

export default function StudentDetails({
  student,
  certificateData,
}: StudentDetailProps) {
  return (
    <div className=" bg-white shadow-md rounded-md m-4">
      <div className="flex items-center justify-between mb-4 p-4"></div>
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
                  {student?.nationality || "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-2">
          {certificateData?.length! > 0 ? (
            <StudentPieChart studentCertificate={certificateData} />
          ) : (
            <div className="flex items-center justify-center bg-slate-200 h-full border rounded shadow-sm text-3xl font-bold">
              No data yet
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-evenly p-4 ">
        <StudentDetailCard title="Program Interest" value="15" />
        <StudentDetailCard title="Program Enrolled" value="9" />
        <StudentDetailCard title="Certificates Earned" value="7" />
        <StudentDetailCard title="Program not completed" value="2" />
        <StudentDetailCard title="Rating" value="4.7" />
      </div>
    </div>
  );
}
