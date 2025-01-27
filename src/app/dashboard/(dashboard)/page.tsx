import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import sponsorData, { clubList, programList, studentList } from "../actions";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DonationTab from "../components/donation/donationTab";
import ProgramsTab from "../components/program/programsTab";
import StudentTabs from "../components/student/student_tab";

export default async function Dashboard() {
  const sponsor = await sponsorData();
  const students = await studentList();
  const clubs = await clubList();
  const programs = await programList();

  return (
    <div className=" mx-auto p-8">
      {/* Background Banner */}
      <div className="bg-gray-300 h-24 rounded-sm"></div>

      {/* Profile Section */}
      <div className="relative -mt-12 flex flex-col items-center">
        {/* Sponsor Image */}
        <Avatar className="w-32 h-32 border-white border-2 rounded-none">
          <AvatarImage src={sponsor?.data?.sponsorData.image!} alt="@SP" />
          <AvatarFallback className="font-bold text-5xl">
            {sponsor?.data?.sponsorData.name!.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">
            {sponsor.data?.sponsorData.name}
          </h2>
          <p className="text-gray-500">{sponsor.data?.sponsorData.email}</p>
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
          <DonationTab
            sponsorData={sponsor.data?.sponsorData!}
            programAllocationData={sponsor.data?.allocatedProgramData!}
            donataionData={sponsor.data?.donataionsData!}
            donationAllocationInvoiceData={
              sponsor.data?.donationAllocationInvoiceData!
            }
          />
        </TabsContent>
        <TabsContent value="program">
          <ProgramsTab
            allocatedProgramData={sponsor.data?.allocatedProgramData!}
            clubList={clubs.data!}
            programList={programs.data!}
          />
        </TabsContent>
        <TabsContent value="student">
          <StudentTabs
            students={students.data?.studentList!}
            certificateData={students.data?.certificateData!}
            supportedStudents={sponsor.data?.studentSupport!}
            programs={programs.data!}
            sponsorId={sponsor.data?.sponsorData.sponsor_id!}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
