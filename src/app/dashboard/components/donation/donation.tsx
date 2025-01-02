import React from "react";
import SummaryCard from "./summaryCard";
import ProgramCard from "./programCard";
import DonationTabs from "./donationTabs";
import { SponsorData } from "@/types/types";

interface DonationProps {
  sponsorData: SponsorData | null;
}

export default function Donation({ sponsorData }: DonationProps) {
  // Data for Donation Summary
  const donationSummaryData = [
    { label: "Total Donations", value: `$${sponsorData?.totalDonationAmount}` },
    {
      label: "Donations Allocated",
      value: `$${sponsorData?.allocatedDonation}`,
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

  // Data for Recent Program Allocation
  const programData = [
    {
      programName: "Robotics Program",
      donation: "$10,000",
      balance: "$0.00",
      couponsUsed: "10",
      couponsRemaining: "20",
      date: "Oct 12, 2024",
    },
    {
      programName: "Aeronautic Program",
      donation: "$10,000",
      balance: "$0.00",
      couponsUsed: "10",
      couponsRemaining: "20",
      date: "Oct 12, 2024",
    },
    {
      programName: "Gravite Race Program",
      donation: "$10,000",
      balance: "$0.00",
      couponsUsed: "10",
      couponsRemaining: "20",
      date: "Oct 12, 2024",
    },
    {
      programName: "Little Inventors Program",
      donation: "$10,000",
      balance: "$0.00",
      couponsUsed: "10",
      couponsRemaining: "20",
      date: "Oct 12, 2024",
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
          {programData.map((program, index) => (
            <ProgramCard
              key={index}
              programName={program.programName}
              donation={program.donation}
              balance={program.balance}
              couponsUsed={program.couponsUsed}
              couponsRemaining={program.couponsRemaining}
              date={program.date}
            />
          ))}
        </div>
      </div>

      {/*Donation Receipt and Donation Allocation Section*/}
      <DonationTabs />
    </div>
  );
}
