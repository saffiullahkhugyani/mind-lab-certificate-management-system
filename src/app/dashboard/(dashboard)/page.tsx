import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Donation from "../components/donation/donation";
import Programs from "../components/program/programs";
import Students from "../components/student/students";
import sponsorData, { studentList } from "../actions";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Dashboard() {
  const sponsor = await sponsorData();
  const students = await studentList();

  console.log(sponsor);

  return (
    <div className=" mx-auto p-8">
      {/* Background Banner */}
      <div className="bg-gray-300 h-24 rounded-sm"></div>

      {/* Profile Section */}
      <div className="relative -mt-12 flex flex-col items-center">
        {/* Sponsor Image */}
        <Avatar className="w-32 h-32 border-white border-2 rounded-none">
          <AvatarImage src={sponsor?.data?.image!} alt="@SP" />
          <AvatarFallback className="font-bold text-5xl">
            {sponsor?.data?.name!.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">{sponsor.data?.name}</h2>
          <p className="text-gray-500">{sponsor.data?.email}</p>
        </div>
      </div>
      {/* Tab Navigation */}
      <Tabs defaultValue="donations" className="mt-4">
        <TabsList className="flex justify-center space-x-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="program">Program</TabsTrigger>
          <TabsTrigger value="student">Student</TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="overview">
          <div>Coming soon</div>
        </TabsContent>
        <TabsContent value="donations">
          <Donation sponsorData={sponsor.data!} />
        </TabsContent>
        <TabsContent value="program">
          <Programs />
        </TabsContent>
        <TabsContent value="student">
          <Students students={students.data!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
