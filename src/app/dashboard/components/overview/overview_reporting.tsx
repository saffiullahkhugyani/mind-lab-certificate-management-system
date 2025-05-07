import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AllocatedProgramData,
  Donation,
  SponsorData,
  StudentNotSupported,
  StudentSupport,
} from "@/types/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React, { useState } from "react";
import SponsorReportPDF from "./generate-pdf-report";
import FilteredReportPDF from "./filtered-pdf-report"; // using other pdf generate component
import { Loader2, Download, Filter } from "lucide-react";

interface OverviewReportingProps {
  sponsorDetails: SponsorData | null;
  donationData: Donation[] | null;
  allocatedProgramData: AllocatedProgramData[] | null;
  supportStudentData?: StudentSupport[] | null;
  studentNotSupported?: StudentNotSupported[] | null;
}

export default function OverviewReporting({
  allocatedProgramData,
  sponsorDetails,
  donationData,
  supportStudentData,
  studentNotSupported,
}: OverviewReportingProps) {
  // State for filters
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [filteredData, setFilteredData] = useState<{
    donations: Donation[] | null;
    allocations: AllocatedProgramData[] | null;
    students: StudentSupport[] | null;
    studentNotSupported: StudentNotSupported[] | null;
  } | null>(null);

  // Get unique program names for dropdown
  const programNames = Array.from(
    new Set(
      allocatedProgramData?.map((item) => item.program_name).filter(Boolean)
    )
  );

  // Calculate summary metrics for the preview
  const totalDonations =
    donationData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const allocatedAmount =
    allocatedProgramData?.reduce(
      (sum, item) => sum + (item.allocated_amount || 0),
      0
    ) || 0;
  const remainingAmount = totalDonations - allocatedAmount;
  const supportedStudents = new Set(
    supportStudentData?.map((item) => item.student_name)
  ).size;

  // Apply filters
  const applyFilters = () => {
    console.log("not suppoerted", studentNotSupported);
    if (
      !donationData ||
      !allocatedProgramData ||
      !supportStudentData ||
      !studentNotSupported
    )
      return;

    let filteredDonations = [...donationData];
    let filteredAllocations = [...allocatedProgramData];
    let filteredStudents = [...supportStudentData];
    let filteredStudentNotSupported = [...studentNotSupported];

    // Date filter
    if (startDate) {
      const start = new Date(startDate);
      filteredDonations = filteredDonations.filter((item) => {
        const itemDate = new Date(item.date || "");
        return itemDate >= start;
      });
      filteredAllocations = filteredAllocations.filter((item) => {
        const itemDate = new Date(item.created_at || "");
        return itemDate >= start;
      });
      filteredStudents = filteredStudents.filter((item) => {
        const itemDate = new Date(item.coupon_start_date || "");
        return itemDate >= start;
      });

      filteredStudentNotSupported = filteredStudentNotSupported.filter(
        (item) => {
          const itemDate = new Date(item.date || "");
          return itemDate >= start;
        }
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      filteredDonations = filteredDonations.filter((item) => {
        const itemDate = new Date(item.date || "");
        return itemDate <= end;
      });
      filteredAllocations = filteredAllocations.filter((item) => {
        const itemDate = new Date(item.created_at || "");
        return itemDate <= end;
      });
      // filteredStudents = filteredStudents.filter((item) => {
      //   const itemDate = new Date(item.coupon_start_date || "");
      //   return itemDate <= end;
      // });

      filteredStudentNotSupported = filteredStudentNotSupported.filter(
        (item) => {
          const itemDate = new Date(item.date || "");
          return itemDate <= end;
        }
      );
    }

    // Program filter
    if (selectedProgram) {
      filteredAllocations = filteredAllocations.filter(
        (item) => item.program_name === selectedProgram
      );
      filteredStudents = filteredStudents.filter(
        (item) => item.program_name === selectedProgram
      );
    }

    setFilteredData({
      donations: filteredDonations,
      allocations: filteredAllocations,
      students: filteredStudents,
      studentNotSupported: filteredStudentNotSupported,
    });
  };

  // Reset filters
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedProgram("");
    setFilteredData(null);
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Filter Section */}
      <div className="bg-white p-6 m-4 rounded-lg border border-gray-200 shadow-sm">
        <h1 className="text-md text-gray-800 mb-4">
          By selecting dates filter you will able to downalod a report for your
          donation, program allocation and student support as a pdf.
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Filter Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Program
            </label>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Programs</SelectItem>
                {programNames.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
          <div className="flex items-end gap-2">
            {filteredData == null && (
              <Button onClick={applyFilters} className="gap-2">
                <Filter className="h-4 w-4" />
                Apply Filters
              </Button>
            )}
            {filteredData != null && (
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* {filteredData && ( */}
      <div className="bg-white p-4 m-4 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports</h2>
        <div className="flex justify-between items-center p-4">
          <div>
            {" "}
            {`Summary Report ${new Date().toISOString().split("T")[0]}.pdf`}
          </div>
          <div className="">
            {filteredData ? (
              <PDFDownloadLink
                document={
                  <SponsorReportPDF
                    sponsorData={sponsorDetails}
                    donationsData={filteredData.donations}
                    programAllocation={filteredData.allocations}
                    studentSupport={filteredData.students}
                    studentNotSupported={filteredData.studentNotSupported}
                    filters={{ startDate, endDate, program: selectedProgram }}
                  />
                }
                fileName={`filtered-report-${
                  new Date().toISOString().split("T")[0]
                }.pdf`}
              >
                {({ loading }) => (
                  <Button className="gap-2" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Export Filtered PDF
                      </>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            ) : (
              <Button className="gap-2" disabled={true}>
                <Download className="h-4 w-4" />
                Export Filtered Pdf
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* )} */}

      {/* Report Preview Section */}
      {/* <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {filteredData ? "Filtered Report Preview" : "Full Report Preview"}
        </h2> */}

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* ... (keep your existing summary cards) ... */}
      {/* </div>  */}

      {/* Download Button for full report */}
      {/* <div className="flex justify-end">
          <PDFDownloadLink
            document={
              <SponsorReportPDF
                sponsorData={sponsorDetails}
                programAllocation={allocatedProgramData}
                donationsData={donationData}
                studentSupport={supportStudentData}
              />
            }
            fileName={`sponsor-report-${
              new Date().toISOString().split("T")[0]
            }.pdf`}
          >
            {({ loading }) => (
              <Button className="gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Full Report...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download Full Report
                  </>
                )}
              </Button>
            )}
          </PDFDownloadLink>
        </div> */}
      {/* </div> */}

      {/* Data Preview */}
      {/* <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {filteredData ? "Filtered Data Preview" : "Raw Data Preview"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="overflow-auto max-h-96">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Allocations
            </h4>
            <pre className="text-xs p-3 bg-gray-50 rounded border border-gray-200">
              {JSON.stringify(
                filteredData?.allocations || allocatedProgramData,
                null,
                2
              )}
            </pre>
          </div>
          <div className="overflow-auto max-h-96">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Student Support
            </h4>
            <pre className="text-xs p-3 bg-gray-50 rounded border border-gray-200">
              {JSON.stringify(
                filteredData?.students || supportStudentData,
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div> */}
    </div>
  );
}
