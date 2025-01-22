import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DonationReceiptForm from "./components/donation-receipt-form";
import { sponsorList } from "./actions";
import { readUserSession } from "@/lib/actions/action";
import { redirect } from "next/navigation";

export default async function Page() {
  const sponsors = await sponsorList();
  // const programs = await programsList();

  const { data: userSession } = await readUserSession();

  if (!userSession.session) {
    return redirect("/login");
  }

  return (
    <div className="p-6 space-x-3 bg-gray-100 w-full">
      <h1 className="text-2xl font-semibold mb-6">Donation Management</h1>

      {/* Tabs */}
      <Tabs
        defaultValue="receipt"
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="receipt">Donation Receipt</TabsTrigger>
        </TabsList>

        <TabsContent value="receipt">
          <DonationReceiptForm sponsors={sponsors.data!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
