import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Donation from "../components/donation/donation";
import Programs from "../components/program/programs";
import Students from "../components/student/students";
import { studentList } from "../actions";

export default async function Dashboard() {
  const students = await studentList();

  return (
    <div className=" mx-auto p-8">
      {/* Background Banner */}
      <div className="bg-gray-300 h-24 rounded-sm"></div>

      {/* Profile Section */}
      <div className="relative -mt-12 flex flex-col items-center">
        <div className="w-24 h-24 bg-black border-2 border-white overflow-hidden">
          <img
            src="https://via.placeholder.com/100" // Replace with actual profile image
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">Ahmed Kajoor</h2>
          <p className="text-gray-500">367 Students Sponsored</p>
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
          <div>Overview content goes here</div>
        </TabsContent>
        <TabsContent value="donations">
          <Donation />
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
