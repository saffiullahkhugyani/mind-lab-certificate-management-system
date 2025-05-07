"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import {
  AllocatedProgramData,
  Donation,
  SponsorData,
  StudentNotSupported,
  StudentSupport,
} from "@/types/types";

interface generateReportProps {
  sponsorData?: SponsorData | null;
  programAllocation: AllocatedProgramData[] | null;
  donationsData?: Donation[] | null;
  studentSupport?: StudentSupport[] | null;
  studentNotSupported?: StudentNotSupported[] | null;
  filters: {
    startDate: string;
    endDate: string;
    program: string;
  };
}

// Register fonts if needed (example)
// Font.register({
//   family: 'Roboto',
//   fonts: [
//     { src: '/fonts/Roboto-Regular.ttf' },
//     { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
//   ]
// });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
    color: "#333",
  },
  header: {
    marginBottom: 30,
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#1a5276",
    paddingBottom: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a5276",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 10,
    marginTop: 5,
  },
  reportInfo: {
    fontSize: 10,
    color: "#7f8c8d",
  },
  sponsorSection: {
    flexDirection: "row",
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#1a5276",
  },
  sponsorInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoLabel: {
    width: 120,
    fontWeight: "bold",
    color: "#1a5276",
  },
  infoValue: {
    flex: 1,
  },
  highlightBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    padding: 10,
    backgroundColor: "#eaf2f8",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#d4e6f1",
    flexWrap: "wrap",
  },
  highlightItem: {
    textAlign: "center",
    padding: 5,
    minWidth: "22%",
    flexGrow: 1,
  },
  highlightValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a5276",
    marginBottom: 3,
  },
  highlightLabel: {
    fontSize: 10,
    color: "#7f8c8d",
  },
  dateFilters: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  filterLabel: {
    fontSize: 10,
    color: "#555",
  },
  filterDate: {
    fontSize: 10,
    marginRight: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a5276",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#d4e6f1",
  },
  table: {
    width: "100%",
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a5276",
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontSize: 9,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontSize: 9,
  },
  tableRowAlt: {
    backgroundColor: "#f8f9fa",
  },
  cell: {
    paddingRight: 8,
    textAlign: "left",
  },
  cellRight: {
    paddingRight: 8,
    textAlign: "right",
  },
  cellCenter: {
    paddingRight: 8,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#7f8c8d",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#7f8c8d",
  },
  noData: {
    textAlign: "center",
    color: "#7f8c8d",
    fontStyle: "italic",
    padding: 10,
  },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontWeight: "bold",
    fontSize: 10,
  },
});

const SponsorReportPDF = ({
  sponsorData,
  programAllocation,
  donationsData,
  studentSupport,
  studentNotSupported,
  filters,
}: generateReportProps) => {
  // Calculate totals
  const totalDonations =
    donationsData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalAllocated =
    programAllocation?.reduce(
      (sum, item) => sum + (item.allocated_amount || 0),
      0
    ) || 0;
  const totalRemaining = totalDonations - totalAllocated;
  const uniqueStudents = new Set(
    studentSupport?.map((item) => item.student_name)
  ).size;
  const uniquePrograms = new Set(
    programAllocation?.map((item) => item.program_name)
  ).size;

  // Format date for report
  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SPONSOR CONTRIBUTION OVERVIEW</Text>
          <Text style={styles.subtitle}>
            Summary of Donation Activity and AllocationThis section provides a
            high-level summary of the sponsor's contributions, allocations, and
            program impact.
          </Text>
          {filters.startDate && filters.endDate && (
            <Text style={styles.reportInfo}>
              Filtered dates: {filters.startDate} to {filters.endDate}
            </Text>
          )}
          <Text style={styles.reportInfo}>Generated on: {reportDate}</Text>
        </View>

        {/* Sponsor Information */}
        {sponsorData && (
          <View style={styles.sponsorSection}>
            <View style={styles.sponsorInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sponsor Name:</Text>
                <Text style={styles.infoValue}>{sponsorData.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sponsor Id:</Text>
                <Text style={styles.infoValue}>{sponsorData.sponsor_id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{sponsorData.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{sponsorData.number}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Key Metrics - Debugged Version */}
        <View style={styles.highlightBox}>
          {/* Total Donations */}
          <View style={styles.highlightItem}>
            <Text style={styles.highlightValue}>
              AED {totalDonations.toFixed(2)}
            </Text>
            <Text style={styles.highlightLabel}>Total Donations</Text>
          </View>
        </View>

        <View style={styles.highlightBox}>
          {/* Allocated */}
          <View style={styles.highlightItem}>
            <Text style={styles.highlightValue}>
              AED {totalAllocated.toFixed(2)}
            </Text>
            <Text style={styles.highlightLabel}>Allocated</Text>
          </View>
        </View>
        <View style={styles.highlightBox}>
          {/* Remaining */}
          <View style={styles.highlightItem}>
            <Text style={styles.highlightValue}>
              AED {totalRemaining.toFixed(2)}
            </Text>
            <Text style={styles.highlightLabel}>Remaining</Text>
          </View>
        </View>
        <View style={styles.highlightBox}>
          {/* Students Supported */}
          <View style={styles.highlightItem}>
            <Text style={styles.highlightValue}>{uniqueStudents}</Text>
            <Text style={styles.highlightLabel}>Students Supported</Text>
          </View>
        </View>
        <View style={styles.highlightBox}>
          {/* Programs Funded */}
          <View style={styles.highlightItem}>
            <Text style={styles.highlightValue}>{uniquePrograms}</Text>
            <Text style={styles.highlightLabel}>Programs Funded</Text>
          </View>
        </View>
      </Page>

      {/* Donation Summary Page*/}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>DONATION HISTORY</Text>
            {filters.startDate && filters.endDate && (
              <View style={styles.dateFilters}>
                <Text style={styles.filterLabel}>Filter Dates:</Text>
                <Text style={styles.filterDate}>
                  {filters.startDate} to {filters.endDate}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle}>
            Chronological Record of Sponsor Contributions. A detailed list of
            all monetary donations made during the selected period, including
            payment methods and timestamps.
          </Text>
          {donationsData && donationsData.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, { width: "20%" }]}>#</Text>
                <Text style={[styles.cell, { width: "20%" }]}>Donation Id</Text>
                <Text style={[styles.cell, { width: "20%" }]}>Method</Text>
                <Text style={[styles.cell, { width: "20%" }]}>
                  Amount (AED)
                </Text>
                <Text style={[styles.cell, { width: "20%" }]}>Date</Text>
                {/* <Text style={[styles.cell, { width: "10%" }]}>Method</Text> */}
              </View>
              {donationsData.map((d, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowAlt : {},
                  ]}
                >
                  <Text style={[styles.cell, { width: "20%" }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.cell, { width: "20%" }]}>
                    {d.donation_id}
                  </Text>
                  <Text style={[styles.cell, { width: "20%" }]}>
                    {d.source_of_amount}
                  </Text>
                  <Text style={[styles.cell, { width: "20%" }]}>
                    {d.amount?.toFixed(2)}
                  </Text>
                  <Text style={[styles.cell, { width: "20%" }]}>
                    {new Date(d.date!).toLocaleDateString("en-AE")}
                  </Text>
                  {/* <Text style={[styles.cell, { width: "10%" }]}>
                    {d.source_of_amount || "N/A"}
                  </Text> */}
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={[styles.cell, { width: "75%" }]}>
                  TOTAL DONATIONS:
                </Text>
                <Text style={[styles.cellRight, { width: "25%" }]}>
                  AED {totalDonations.toFixed(2)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noData}>No donation data available</Text>
          )}
        </View>
      </Page>

      {/* Donation Allocation Summary Page*/}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>FUND ALLOCATION LOG</Text>
            {filters.startDate && filters.endDate && (
              <View style={styles.dateFilters}>
                <Text style={styles.filterLabel}>Filter Dates:</Text>
                <Text style={styles.filterDate}>
                  {filters.startDate} to {filters.endDate}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle}>
            Breakdown of Fund Distribution by Program. Outlines how the donated
            funds were allocated across various educational programs, showing
            both the amount and date of allocation.
          </Text>
          {programAllocation && programAllocation.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, { width: "15%" }]}>#</Text>
                <Text style={[styles.cell, { width: "15%" }]}>
                  Allocation Id
                </Text>
                <Text style={[styles.cell, { width: "30%" }]}>Program</Text>
                {/* <Text style={[styles.cell, { width: "35%" }]}>Description</Text> */}
                <Text style={[styles.cell, { width: "20%" }]}>Allocated</Text>
                {/* <Text style={[styles.cellRight, { width: "15%" }]}>
                  Remaining
                </Text> */}
                <Text style={[styles.cell, { width: "20%" }]}>Date</Text>
              </View>
              {programAllocation.map((pa, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowAlt : {},
                  ]}
                >
                  <Text style={[styles.cell, { width: "15%" }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.cell, { width: "15%" }]}>{pa.id}</Text>
                  <Text style={[styles.cell, { width: "30%" }]}>
                    {pa.program_name || "N/A"}
                  </Text>
                  {/* <Text style={[styles.cell, { width: "35%" }]}>
                    {pa.description || "N/A"}
                  </Text> */}
                  <Text style={[styles.cell, { width: "20%" }]}>
                    {pa.allocated_amount?.toFixed(2)}
                  </Text>
                  {/* <Text style={[styles.cellRight, { width: "15%" }]}>
                    {pa.remaining_allocated_amount?.toFixed(2)}
                  </Text> */}
                  <Text style={[styles.cell, { width: "20%" }]}>
                    {new Date(pa.created_at!).toLocaleDateString("en-AE")}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noData}>No allocation data available</Text>
          )}
        </View>
      </Page>

      {/* Student Not Supported Summary Page*/}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>
              STUDENTS WITH CANCELED SPONSORSHIP
            </Text>
            {filters.startDate && filters.endDate && (
              <View style={styles.dateFilters}>
                <Text style={styles.filterLabel}>Filter Dates:</Text>
                <Text style={styles.filterDate}>
                  {filters.startDate} to {filters.endDate}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle}>
            List of Students Whose Support Was Canceled Description, This
            section includes students whose sponsorships were initially assigned
            but later canceled by the sponsor during the reporting period.
          </Text>
          {studentNotSupported && studentNotSupported.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, { width: "8%" }]}>#</Text>
                <Text style={[styles.cell, { width: "20%" }]}>Student Id</Text>
                <Text style={[styles.cell, { width: "22%" }]}>
                  Student Name
                </Text>
                <Text style={[styles.cell, { width: "20%" }]}>
                  Program Name
                </Text>
                <Text style={[styles.cell, { width: "15%" }]}>
                  Support Status
                </Text>
                <Text style={[styles.cell, { width: "15%" }]}>Date</Text>
              </View>
              {studentNotSupported.map((sns, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowAlt : {},
                  ]}
                >
                  <Text style={[styles.cellCenter, { width: "8%" }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.cell, { width: "20%" }]}>
                    {sns.student_id || "N/A"}
                  </Text>
                  <Text style={[styles.cell, { width: "22%" }]}>
                    {sns.student_name || "N/A"}
                  </Text>
                  <Text style={[styles.cellCenter, { width: "20%" }]}>
                    {sns.program_name || "N/A"}
                  </Text>
                  <Text style={[styles.cellCenter, { width: "15%" }]}>
                    {sns.support_status ? " Supported" : "Not Supported"}
                  </Text>
                  <Text style={[styles.cell, { width: "15%" }]}>
                    {sns.date || "N/A"}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noData}>
              No student not supported data available
            </Text>
          )}
        </View>
      </Page>

      {/* Student Support Summary Page*/}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>
              ACTIVE STUDENT SUPPORT TRACKER
            </Text>
            {filters.startDate && filters.endDate && (
              <View style={styles.dateFilters}>
                <Text style={styles.filterLabel}>Filter Dates:</Text>
                <Text style={styles.filterDate}>
                  {filters.startDate} to {filters.endDate}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle}>
            Ongoing and Completed Sponsorship Engagements. Presents students who
            have been successfully supported by the sponsor, including coupon
            status, program duration, and outcomes.
          </Text>
          {studentSupport && studentSupport.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, { width: "8%" }]}>#</Text>
                <Text style={[styles.cell, { width: "20%" }]}>Student</Text>
                <Text style={[styles.cell, { width: "22%" }]}>Program</Text>
                <Text style={[styles.cell, { width: "15%" }]}>Coupon Code</Text>
                <Text style={[styles.cell, { width: "20%" }]}>
                  Coupon Status
                </Text>
                <Text style={[styles.cell, { width: "15%" }]}>Start Date</Text>
                <Text style={[styles.cell, { width: "15%" }]}>Expiry Date</Text>
              </View>
              {studentSupport.map((ss, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowAlt : {},
                  ]}
                >
                  <Text style={[styles.cellCenter, { width: "8%" }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.cell, { width: "20%" }]}>
                    {ss.student_name || "N/A"}
                  </Text>
                  <Text style={[styles.cell, { width: "22%" }]}>
                    {ss.program_name || "N/A"}
                  </Text>
                  <Text style={[styles.cellCenter, { width: "15%" }]}>
                    {ss.coupon_code || "N/A"}
                  </Text>
                  <Text style={[styles.cellCenter, { width: "20%" }]}>
                    {ss.coupon_status || "N/A"}
                  </Text>
                  <Text style={[styles.cell, { width: "15%" }]}>
                    {ss.coupon_start_date || "N/A"}
                  </Text>
                  <Text style={[styles.cell, { width: "15%" }]}>
                    {ss.coupon_end_date || "N/A"}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noData}>No student support data available</Text>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This report was generated by {sponsorData?.name} via Sponsor
          Management System
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default SponsorReportPDF;
