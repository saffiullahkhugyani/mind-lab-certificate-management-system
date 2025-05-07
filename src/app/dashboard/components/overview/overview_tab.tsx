import React from "react";
import OverviewReportTabs from "./overview_report_tabs";
import {
  SponsorData,
  AllocatedProgramData,
  Donation,
  StudentSupport,
  StudentNotSupported,
} from "@/types/types";

interface OverviewTabProps {
  sponsorData: SponsorData | null;
  programAllocationData: AllocatedProgramData[] | null;
  donataionData: Donation[] | null;
  donationAllocationInvoiceData: AllocatedProgramData[] | null;
  studentSupport: StudentSupport[] | null;
  studentNotSupported: StudentNotSupported[] | null;
}

export default function OverviewTab({
  sponsorData,
  programAllocationData,
  donataionData,
  donationAllocationInvoiceData,
  studentSupport,
  studentNotSupported,
}: OverviewTabProps) {
  return (
    <OverviewReportTabs
      sponsorDetails={sponsorData}
      donationData={donataionData}
      allocatedProgramData={donationAllocationInvoiceData}
      supportStudentData={studentSupport}
      studentNotSupported={studentNotSupported}
    />
  );
}
