"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import ReceiptDetails from "./donationReceiptDetails";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Donation, SponsorData } from "@/types/types";
import { Button } from "@/components/ui/button";

interface DonationReceiptProps {
  sponsorDetails: SponsorData | null;
  donationReceipt: Donation[] | null;
}

const DonationReceipt = ({
  donationReceipt,
  sponsorDetails,
}: DonationReceiptProps) => {
  const [filteredReceipt, setFilteredReceipt] = useState<Donation[] | null>(
    donationReceipt
  );
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Donation | null>(
    donationReceipt?.[0] || null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const receiptsPerPage = 10;

  // Calculate pagination
  const indexOfLastReceipt = currentPage * receiptsPerPage;
  const indexOfFirstReceipt = indexOfLastReceipt - receiptsPerPage;
  const currentReceipts =
    filteredReceipt?.slice(indexOfFirstReceipt, indexOfLastReceipt) || [];
  const totalPages = Math.ceil(
    (filteredReceipt?.length || 0) / receiptsPerPage
  );

  const handleSearchReceipt = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.trim();
    setFilteredReceipt(
      query
        ? donationReceipt?.filter(
            (receipt) => receipt.donation_id === Number(query)
          ) || []
        : donationReceipt
    );
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredReceipt(donationReceipt);
      setCurrentPage(1); // Reset to first page when clearing filters
      return;
    }
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;

    const filtered = donationReceipt?.filter((receipt) => {
      const donationDate = new Date(receipt.date!).getTime();
      return (!start || donationDate >= start) && (!end || donationDate <= end);
    });
    setFilteredReceipt(filtered || []);
    setCurrentPage(1); // Reset to first page when filtering
  };

  useEffect(() => {
    handleDateFilter();
  }, [startDate, endDate]);

  const handleReceiptSelection = (donationId: number) => {
    const selected = filteredReceipt?.find(
      (receipt) => receipt.donation_id === donationId
    );
    setSelectedReceipt(selected || null);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* Sidebar */}
      <div className="col-span-1 border-r pr-4">
        <h2 className="text-lg font-semibold mb-4">Donation Receipt</h2>

        {/* Search Bar */}
        <Input
          type="text"
          placeholder="Search by invoice Id..."
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
            value={selectedReceipt?.donation_id?.toString()}
            onValueChange={(value) => handleReceiptSelection(Number(value))}
          >
            {currentReceipts?.map((receipt) => (
              <div
                key={receipt.donation_id}
                className={`flex items-center space-x-2 p-2 ${
                  selectedReceipt?.donation_id === receipt.donation_id
                    ? "bg-[#00784787] text-white rounded-sm" // Selected Item Styling
                    : "bg-white" // Default Styling
                }`}
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
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
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
          <ReceiptDetails
            sponsorDetails={sponsorDetails}
            donationReceipt={selectedReceipt}
          />
        ) : (
          <p className="flex justify-center text-lg">
            <strong>Please select a receipt to download</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default DonationReceipt;
