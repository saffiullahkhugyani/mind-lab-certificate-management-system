import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Profiles } from "@/types/customs";
import Image from "next/image";
import React from "react";
import { StudentPieChart } from "./student-pie-chart";
import DetailsCard from "./detail-card";

interface StudentDetailsProps {
  student: Profiles;
  onBack: () => void;
}

export default function StudentDetails({
  student,
  onBack,
}: StudentDetailsProps) {
  return (
    <div className=" bg-white shadow-md rounded-md">
      <div className="flex items-center justify-between mb-4 p-4">
        <Button variant="ghost" onClick={onBack} className="font-bold text-lg">
          ← Back
        </Button>
      </div>
      <div className="grid grid-cols-2 p-4 ">
        <Card className="max-w-md shadow-md border bg-slate-100">
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
                  {"UAE"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <StudentPieChart />
      </div>
      <div className="flex justify-evenly p-4 ">
        <DetailsCard title="Program Interest" value="15" />
        <DetailsCard title="Program Enrolled" value="9" />
        <DetailsCard title="Certificates Earned" value="7" />
        <DetailsCard title="Program not completed" value="2" />
        <DetailsCard title="Rating" value="4.7" />
      </div>
    </div>
  );
}
