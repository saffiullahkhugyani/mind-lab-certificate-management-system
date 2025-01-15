import React from "react";
import SummaryCard from "./summaryCard";
import ProgramCard from "./programCard";
import { AllocatedProgramData, Donation, SponsorData } from "@/types/types";
import DonationReceiptTabs from "./donationReceiptTabs";

interface DonationProps {
  sponsorData: SponsorData | null;
  programAllocationData: AllocatedProgramData[] | null;
  donataionData: Donation[] | null;
  donationAllocationInvoiceData: AllocatedProgramData[] | null;
}

export default function DonationTab({
  sponsorData,
  programAllocationData,
  donataionData,
  donationAllocationInvoiceData,
}: DonationProps) {
  // Data for Donation Summary
  const donationSummaryData = [
    { label: "Total Donations", value: `$${sponsorData?.totalDonationAmount}` },
    {
      label: "Donations To Be Allocated",
      value: `$${sponsorData?.totalRemainingDonation}`,
    },
    {
      label: "Program Funded",
      value: sponsorData?.programs_funded.toString()!,
    },
    {
      label: "Students supported",
      value: "0",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Donation Summary Section */}
      <div className="bg-white shadow-md p-4 rounded-sm">
        <h2 className="text-xl font-semibold mb-4">Donation Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {donationSummaryData.map((item, index) => (
            <SummaryCard key={index} label={item.label} value={item.value} />
          ))}
        </div>
      </div>

      {/* Recent Program Allocation Section */}
      <div className="bg-white shadow-md p-4 rounded-sm">
        <h2 className="text-xl font-semibold">Recent Program Allocation</h2>
        <div className="grid grid-cols-2  ">
          {programAllocationData?.map((program, index) => (
            <ProgramCard
              key={index}
              programName={program.program_name!}
              donation={program.allocated_amount!}
              balance={program.remaining_allocated_amount!}
              availableCoupons={Math.floor(
                program.remaining_allocated_amount! /
                  Number(program.subscription_value!)
              )}
              date={program.created_at!}
            />
          ))}
        </div>
      </div>

      {/*Donation Receipt and Donation Allocation Section*/}
      <DonationReceiptTabs
        donationData={donataionData}
        sponsorDetails={sponsorData}
        allocatedProgramData={donationAllocationInvoiceData}
      />
    </div>
  );
}
