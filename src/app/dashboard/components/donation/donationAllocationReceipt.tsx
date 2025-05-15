"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AllocatedProgramData, SponsorData } from "@/types/types";
import DonationAllocationReceiptDetail from "./donationAllocationReceiptDetail";
import { Button } from "@/components/ui/button";

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
  const [currentPage, setCurrentPage] = useState(1);
  const receiptsPerPage = 10;

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
    setCurrentPage(1); // Reset to first page when filtering
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
    setCurrentPage(1); // Reset to first page when filtering
  };

  useEffect(() => {
    handleDateFilter();
  }, [startDate, endDate]);

  const handleReceiptSelection = (allocatedId: number) => {
    const selected = filteredReceipt?.find(
      (receipt) => receipt.id === allocatedId
    );
    setSelectedReceipt(selected || null);
  };

  // Get current receipts for pagination
  const indexOfLastReceipt = currentPage * receiptsPerPage;
  const indexOfFirstReceipt = indexOfLastReceipt - receiptsPerPage;
  const currentReceipts = filteredReceipt?.slice(
    indexOfFirstReceipt,
    indexOfLastReceipt
  );
  const totalPages = Math.ceil(
    (filteredReceipt?.length || 0) / receiptsPerPage
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
        <div className="grid grid-cols-2 mb-4 gap-2">
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
            {currentReceipts?.map((receipt) => (
              <div
                key={receipt.id}
                className={`flex items-center space-x-2 p-2 ${
                  selectedReceipt?.id === receipt.id
                    ? "bg-[#00784787] text-white rounded-sm" // Selected Item Styling
                    : "bg-white" // Default Styling
                }`}
              >
                <RadioGroupItem
                  value={receipt.id?.toString()!}
                  id={`r-${receipt.id}`}
                />
                <Label htmlFor={`r-${receipt.id}`}>
                  Invoice ID: {receipt.id}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <Button
                  key={number}
                  variant={currentPage === number ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(number)}
                >
                  {number}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
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
