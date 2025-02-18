"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import sponsorData, { clubList, programList, studentList } from "../actions";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DonationTab from "../components/donation/donationTab";
import ProgramsTab from "../components/program/programsTab";
import StudentTabs from "../components/student/student_tab";
import {
  AllocatedProgramData,
  CertificateDetails,
  Donation,
  ProgramCertificateStudentMapping,
  Programs,
  SponsorData,
  StudentInterestData,
  StudentSupport,
} from "@/types/types";
import { Clubs, Profiles } from "@/types/customs";
import { useRouter, useSearchParams } from "next/navigation";

interface DashboardProps {
  sponsor: SponsorData | null;
  programAllocatedData: AllocatedProgramData[] | null;
  donataionData: Donation[] | null;
  donationAllocationInvoiceData: AllocatedProgramData[] | null;
  clubs: Clubs[] | null;
  programs: Programs[] | null;
  students: Profiles[] | null;
  certificateData: CertificateDetails[] | null;
  studentSupport: StudentSupport[] | null;
  studentInterest: StudentInterestData[] | null;
  certificateEarned: ProgramCertificateStudentMapping[] | null;
}

export default function Dashboard({
  sponsor,
  programAllocatedData,
  donataionData,
  donationAllocationInvoiceData,
  clubs,
  programs,
  students,
  certificateData,
  studentSupport,
  studentInterest,
  certificateEarned,
}: DashboardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultTab = searchParams.get("tab") || "donations"; // Read from URL or default to "donations"

  const [activeTab, setActiveTab] = useState(defaultTab);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

  return (
    <div className=" mx-auto p-8">
      {/* Background Banner */}
      <div className="bg-gray-300 h-24 rounded-md"></div>

      {/* Profile Section */}
      <div className="relative -mt-12 flex flex-col items-center">
        {/* Sponsor Image */}
        <Avatar className="w-32 h-32 border-white border-2 rounded-none">
          <AvatarImage
            src={sponsor?.image || "/no-user-image.jpeg"}
            alt="@SP"
            className="w-full h-full object-cover rounded-none aspect-square"
          />
          <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700 font-bold text-5xl">
            {sponsor?.name?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>

        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">
            {sponsor?.name || "Unknown Sponsor"}
          </h2>
          <p className="text-gray-500">
            {sponsor?.email || "No email available"}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
        <TabsList className="flex justify-center space-x-4">
          <TabsTrigger value="overview" variant={"customOne"}>
            Overview
          </TabsTrigger>
          <TabsTrigger value="donations" variant={"customOne"}>
            Donations
          </TabsTrigger>
          <TabsTrigger value="program" variant={"customOne"}>
            Program
          </TabsTrigger>
          <TabsTrigger value="student" variant={"customOne"}>
            Student
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="overview">
          <div>Coming soon</div>
        </TabsContent>
        <TabsContent value="donations">
          <DonationTab
            sponsorData={sponsor}
            programAllocationData={programAllocatedData}
            donataionData={donataionData}
            donationAllocationInvoiceData={donationAllocationInvoiceData!}
          />
        </TabsContent>
        <TabsContent value="program">
          <ProgramsTab
            allocatedProgramData={programAllocatedData}
            clubList={clubs}
            programList={programs}
          />
        </TabsContent>
        <TabsContent value="student">
          <StudentTabs
            students={students!}
            certificateData={certificateData}
            supportedStudents={studentSupport!}
            programs={programs}
            sponsorId={sponsor?.sponsor_id!}
            studentInterest={studentInterest}
            certificateEarned={certificateEarned}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
