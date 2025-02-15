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
    <div className="bg-white shadow-md rounded-md mx-2 my-2 sm:m-4">
      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2 sm:p-4">
        {/* Profile Card */}
        <Card className="col-span-1 shadow-md border bg-slate-100 w-full">
          <CardHeader className="flex flex-col items-center p-3 sm:p-4">
            <Avatar className="w-20 h-20 sm:w-32 md:w-40 sm:h-32 md:h-40 rounded-none border">
              <AvatarImage
                src={student?.profile_image_url!}
                alt={student?.name || "Profile"}
              />
              <AvatarFallback className="font-bold text-2xl sm:text-4xl md:text-5xl rounded-none bg-gray-300">
                {student?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="px-3 py-2 sm:p-4 space-y-2 sm:space-y-4">
            {/* Display Name */}
            <div className="space-y-1">
              <Label className="text-xs sm:text-sm font-semibold text-gray-600">
                Display Name
              </Label>
              <div className="p-1.5 sm:p-2 bg-gray-300 rounded-md text-xs sm:text-sm text-gray-800">
                {student?.name || "N/A"}
              </div>
            </div>
            {/* Age Group and Nationality */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm font-semibold text-gray-600">
                  Age Group
                </Label>
                <div className="p-1.5 sm:p-2 bg-gray-300 rounded-md text-xs sm:text-sm text-gray-800">
                  {student?.age || "N/A"}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm font-semibold text-gray-600">
                  Nationality
                </Label>
                <div className="p-1.5 sm:p-2 bg-gray-300 rounded-md text-xs sm:text-sm text-gray-800">
                  {student?.nationality || "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart Section */}
        <div className="col-span-1 md:col-span-2 min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
          {certificateData?.length! > 0 ? (
            <div className="h-full w-full">
              <StudentPieChart studentCertificate={certificateData} />
            </div>
          ) : (
            <div className="flex items-center justify-center bg-slate-200 h-full border rounded shadow-sm text-lg sm:text-xl md:text-3xl font-bold">
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 p-2 sm:p-4">
        <StudentDetailCard
          title="Program Interest"
          value="15"
          // className="text-sm sm:text-base"
        />
        <StudentDetailCard
          title="Program Enrolled"
          value="9"
          // className="text-sm sm:text-base"
        />
        <StudentDetailCard
          title="Certificates Earned"
          value="7"
          // className="text-sm sm:text-base"
        />
        <StudentDetailCard
          title="Program not completed"
          value="2"
          // className="text-sm sm:text-base"
        />
        <StudentDetailCard
          title="Rating"
          value="4.7"
          // className="text-sm sm:text-base"
        />
      </div>
    </div>
  );
}
