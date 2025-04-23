import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DonationReceiptForm from "./components/donation-receipt-form";
import { donationAllocation, sponsorList } from "./actions";
import { readUserSession } from "@/lib/actions/action";
import { redirect } from "next/navigation";
import OverviewReportTabs from "./components/donation-overview-tabs";

export default async function Page() {
  const sponsors = await sponsorList();
  const donataionData = await donationAllocation();

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
        <TabsList className="space-x-4">
          <TabsTrigger value="receipt" variant={"customOne"}>
            Donation Receipt
          </TabsTrigger>
          <TabsTrigger value="donation-overview" variant={"customOne"}>
            Donation Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="receipt">
          <DonationReceiptForm sponsors={sponsors.data!} />
        </TabsContent>

        <TabsContent value="donation-overview">
          <div>
            <OverviewReportTabs
              sponsorDetails={null}
              donationData={donataionData.data?.donationInvoiceData!}
              allocatedProgramData={
                donataionData.data?.donationAllocationInvoiceData!
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
