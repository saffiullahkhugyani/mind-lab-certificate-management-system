import React from "react";
import OverviewReportTabs from "./overview_report_tabs";
import {
  SponsorData,
  AllocatedProgramData,
  Donation,
  StudentSupport,
} from "@/types/types";

interface OverviewTabProps {
  sponsorData: SponsorData | null;
  programAllocationData: AllocatedProgramData[] | null;
  donataionData: Donation[] | null;
  donationAllocationInvoiceData: AllocatedProgramData[] | null;
  studentSupport: StudentSupport[] | null;
}

export default function OverviewTab({
  sponsorData,
  programAllocationData,
  donataionData,
  donationAllocationInvoiceData,
  studentSupport,
}: OverviewTabProps) {
  return (
    <OverviewReportTabs
      sponsorDetails={sponsorData}
      donationData={donataionData}
      allocatedProgramData={donationAllocationInvoiceData}
      supportStudentData={studentSupport}
    />
  );
}
