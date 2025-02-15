"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AssignedProgramCertificate } from "@/types/types";
import Certificate from "./certificate";

interface CertificateListProps {
  assignedCertificate: AssignedProgramCertificate[] | null;
}

const CertificateList = ({ assignedCertificate }: CertificateListProps) => {
  const [filteredCertificate, setFilteredCertificate] = useState<
    AssignedProgramCertificate[] | null
  >(assignedCertificate);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selected, setSelected] = useState<AssignedProgramCertificate | null>(
    assignedCertificate?.[0] || null
  );

  console.log(assignedCertificate);

  const handleSearchReceipt = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.trim();
    console.log(query);
    setFilteredCertificate(
      query
        ? assignedCertificate?.filter((certificate) =>
            certificate.student_name?.toLowerCase().includes(query)
          ) || []
        : assignedCertificate
    );
  };

  //   const handleDateFilter = () => {
  //     if (!startDate && !endDate) {
  //       setFilteredReceipt(donationReceipt);
  //       return;
  //     }
  const start = startDate ? new Date(startDate).getTime() : null;
  const end = endDate ? new Date(endDate).getTime() : null;

  //     const filtered = donationReceipt?.filter((receipt) => {
  //       const donationDate = new Date(receipt.date!).getTime();
  //       return (!start || donationDate >= start) && (!end || donationDate <= end);
  //     });
  //     setFilteredReceipt(filtered || []);
  //   };

  //   useEffect(() => {
  //     handleDateFilter();
  //   }, [startDate, endDate]);

  const handleCertificateSelection = (certificateId: number) => {
    const selected = filteredCertificate?.find(
      (receipt) => receipt.id === certificateId
    );
    setSelected(selected || null);
  };

  return (
    <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* Sidebar */}
      <div className="col-span-1 border-r pr-4">
        <h2 className="text-lg font-semibold mb-4">
          Assigned program certificates
        </h2>

        {/* Search Bar */}
        <Input
          type="text"
          placeholder="Search by student name..."
          className="w-full mb-4 p-2 border rounded"
          onChange={handleSearchReceipt}
        />

        {/* Date Filter */}
        {/* <div className="flex">
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
        </div> */}

        {/* Donation IDs */}
        <div className="space-y-2">
          <RadioGroup
            value={selected?.id?.toString()}
            onValueChange={(value) => handleCertificateSelection(Number(value))}
          >
            {filteredCertificate?.map((certificate) => (
              <div
                key={certificate.id}
                className="flex items-center space-x-2 m-2"
              >
                <RadioGroupItem
                  value={certificate.id?.toString()!}
                  id={`r-${certificate.id}`}
                />
                <Label htmlFor={`r-${certificate.id}`}>
                  Certificate: {certificate.id}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Donation Details */}
      <div className="col-span-3">
        {selected ? (
          <Certificate
            certificate_name={selected.certificate_name!}
            student_id={selected.student_id!}
            student_name={selected.student_name!}
            program={selected.program_name!}
            number_of_hours={selected.number_of_hours!}
            tags={selected.tags!}
            date={selected.date!}
          />
        ) : (
          <p className="flex justify-center text-lg">
            <strong>Please select a certificate to download</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default CertificateList;
