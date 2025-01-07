"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AllocatedProgramData, SponsorData } from "@/types/types";
import DonationAllocationReceiptDetail from "./donationAllocationReceiptDetail";

interface DonationAllocationReceiptProps {
  sponsorDetails: SponsorData | null;
  allocatedProgramData: AllocatedProgramData[] | null;
}

export default function DonationAllocationReceipt({
  allocatedProgramData,
  sponsorDetails,
}: DonationAllocationReceiptProps) {
  const [filteredReceipt, setFilteredReceipt] = useState<
    AllocatedProgramData[] | null
  >(allocatedProgramData);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] =
    useState<AllocatedProgramData | null>(allocatedProgramData?.at(0)!);

  const handleSearchReceipt = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.trim();
    if (!query) {
      setFilteredReceipt(allocatedProgramData);
      return;
    }
    const filter = allocatedProgramData?.filter(
      (receipt) => receipt.id === Number(query)
    );
    setFilteredReceipt(filter || []);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredReceipt(allocatedProgramData);
      return;
    }
    const filter = allocatedProgramData?.filter((receipt) => {
      const donationDate = new Date(receipt.created_at!).getTime();
      const start = startDate ? new Date(startDate).getTime() : null;
      const end = endDate ? new Date(endDate).getTime() : null;
      return (!start || donationDate >= start) && (!end || donationDate <= end);
    });
    setFilteredReceipt(filter || []);
  };

  useEffect(() => {
    handleDateFilter();
  }, [startDate, endDate]);

  const handleReceiptSelection = (allocatedId: number) => {
    const selected = filteredReceipt?.find(
      (receipt) => receipt.id === allocatedId
    );
    setSelectedReceipt(selected || null);
    console.log("Selected Receipt:", selected);
  };

  return (
    <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* Sidebar */}
      <div className="col-span-1 border-r pr-4">
        <h2 className="text-lg font-semibold mb-4">Donation Allocation</h2>

        {/* Search Bar */}
        <Input
          type="text"
          placeholder="Search Invoice..."
          className="w-full mb-4 p-2 border rounded"
          onChange={handleSearchReceipt}
        />

        {/* Date Filter */}
        <div className="flex mb-4 gap-2">
          <Input
            type="date"
            placeholder="Start Date"
            className="p-2 border rounded"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            placeholder="End Date"
            className="p-2 border rounded"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Donation IDs */}
        <div className="space-y-2">
          <RadioGroup
            defaultValue={filteredReceipt?.at(0)?.id.toString()}
            onValueChange={(value) => handleReceiptSelection(Number(value))}
          >
            {filteredReceipt?.map((receipt) => (
              <div key={receipt.id} className="flex items-center space-x-2 m-2">
                <RadioGroupItem
                  value={receipt.id?.toString()!}
                  id={`r-${receipt.id}`}
                />
                <Label htmlFor={`r-${receipt.id}`}>
                  Donation ID: {receipt.id}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Donation Details */}
      <div className="col-span-3">
        {selectedReceipt ? (
          <DonationAllocationReceiptDetail
            sponsorDetails={sponsorDetails}
            allocatedProgramData={selectedReceipt!}
          />
        ) : (
          <p className="flex justify-self-center text-lg">
            <strong>Please select a receipt to download </strong>
          </p>
        )}
      </div>
    </div>
  );
}
