import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CreateProgramForm from "./components/create-program-form";
import ProgramAllocationForm from "./components/program-allocation-form";
import { clubsList, getAvailableDonation, programsList } from "./actions";
import { readUserSession } from "@/lib/actions/action";
import { redirect } from "next/navigation";

export default async function Page() {
  const clubs = await clubsList();
  const programs = await programsList();
  const availableDonationAmount = await getAvailableDonation();

  console.log("Available Donations: ", availableDonationAmount);

  const { data: userSession } = await readUserSession();

  if (!userSession.session) {
    return redirect("/login");
  }

  return (
    <div className="p-6 space-x-3 bg-gray-100 w-full">
      <h1 className="text-2xl font-semibold mb-6">Program Management</h1>

      {/* Tabs */}
      <Tabs
        defaultValue="program"
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="program">Program creation</TabsTrigger>
          <TabsTrigger value="allocation">Program allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="program">
          <CreateProgramForm clubsList={clubs.data!} />
        </TabsContent>

        <TabsContent value="allocation">
          <ProgramAllocationForm
            programs={programs}
            availableAmount={availableDonationAmount.data}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
