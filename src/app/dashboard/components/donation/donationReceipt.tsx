"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import ReceiptDetails from "./receiptDetails";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Donation, SponsorData } from "@/types/types";

interface DonationReceiptProps {
  sponsorDetails: SponsorData | null;
  donationReceipt: Donation[] | null;
}

export default function DonationReceipt({
  donationReceipt,
  sponsorDetails,
}: DonationReceiptProps) {
  const [filteredReceipt, setFilteredReceipt] = useState<Donation[] | null>(
    donationReceipt
  );
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Donation | null>(null);

  const handleSearchReceipt = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.trim();
    if (!query) {
      setFilteredReceipt(donationReceipt);
      return;
    }
    const filter = donationReceipt?.filter(
      (receipt) => receipt.donation_id === Number(query)
    );
    setFilteredReceipt(filter || []);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredReceipt(donationReceipt);
      return;
    }
    const filter = donationReceipt?.filter((receipt) => {
      const donationDate = new Date(receipt.date!).getTime();
      const start = startDate ? new Date(startDate).getTime() : null;
      const end = endDate ? new Date(endDate).getTime() : null;
      return (!start || donationDate >= start) && (!end || donationDate <= end);
    });
    setFilteredReceipt(filter || []);
  };

  useEffect(() => {
    handleDateFilter();
  }, [startDate, endDate]);

  const handleReceiptSelection = (donationId: number) => {
    const selected = filteredReceipt?.find(
      (receipt) => receipt.donation_id === donationId
    );
    setSelectedReceipt(selected || null);
    console.log("Selected Receipt:", selected);
  };

  return (
    <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* Sidebar */}
      <div className="col-span-1 border-r pr-4">
        <h2 className="text-lg font-semibold mb-4">Donation Receipt</h2>

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
            defaultValue=""
            onValueChange={(value) => handleReceiptSelection(Number(value))}
          >
            {filteredReceipt?.map((receipt) => (
              <div
                key={receipt.donation_id}
                className="flex items-center space-x-2 m-2"
              >
                <RadioGroupItem
                  value={receipt.donation_id?.toString()!}
                  id={`r-${receipt.donation_id}`}
                />
                <Label htmlFor={`r-${receipt.donation_id}`}>
                  Donation ID: {receipt.donation_id}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Donation Details */}
      <div className="col-span-3">
        {selectedReceipt ? (
          <ReceiptDetails
            sponsorDetails={sponsorDetails}
            donationReceipt={selectedReceipt}
          />
        ) : (
          <p className="flex justify-self-center text-lg">
            <strong>Please select a receript to download </strong>
          </p>
        )}
      </div>
    </div>
  );
}
