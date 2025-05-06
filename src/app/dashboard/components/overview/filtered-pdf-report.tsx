import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { AllocatedProgramData, StudentSupport } from "@/types/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 10,
  },
  filterInfo: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    fontSize: 9,
    paddingHorizontal: 4,
  },
  cellHeader: {
    fontWeight: "bold",
  },
});

interface FilteredReportPDFProps {
  allocations: AllocatedProgramData[] | null;
  students: StudentSupport[] | null;
  filters: {
    startDate: string;
    endDate: string;
    program: string;
  };
}

const FilteredReportPDF = ({
  allocations,
  students,
  filters,
}: FilteredReportPDFProps) => {
  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>FILTERED REPORT</Text>
          <Text style={styles.subtitle}>Generated on: {reportDate}</Text>
        </View>

        <View style={styles.filterInfo}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Filters Applied:</Text>
          </Text>
          <Text>
            Date Range: {filters.startDate || "No start date"} to{" "}
            {filters.endDate || "No end date"}
          </Text>
          <Text>Program: {filters.program || "All programs"}</Text>
        </View>

        {/* Allocations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ALLOCATIONS</Text>
          {allocations && allocations.length > 0 ? (
            <>
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.cellHeader]}>Program</Text>
                <Text style={[styles.cell, styles.cellHeader]}>
                  Description
                </Text>
                <Text style={[styles.cell, styles.cellHeader]}>Amount</Text>
                <Text style={[styles.cell, styles.cellHeader]}>Date</Text>
              </View>
              {allocations.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.cell}>{item.program_name || "N/A"}</Text>
                  <Text style={styles.cell}>{item.description || "N/A"}</Text>
                  <Text style={styles.cell}>
                    AED {item.allocated_amount?.toFixed(2)}
                  </Text>
                  <Text style={styles.cell}>
                    {new Date(item.created_at || "").toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <Text>No allocation data matching filters</Text>
          )}
        </View>

        {/* Students Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STUDENT SUPPORT</Text>
          {students && students.length > 0 ? (
            <>
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.cellHeader]}>Student</Text>
                <Text style={[styles.cell, styles.cellHeader]}>Program</Text>
                <Text style={[styles.cell, styles.cellHeader]}>
                  Coupon Code
                </Text>
                <Text style={[styles.cell, styles.cellHeader]}>Start Date</Text>
                <Text style={[styles.cell, styles.cellHeader]}>End Date</Text>
              </View>
              {students.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.cell}>{item.student_name || "N/A"}</Text>
                  <Text style={styles.cell}>{item.program_name || "N/A"}</Text>
                  <Text style={styles.cell}>{item.coupon_code || "N/A"}</Text>
                  <Text style={styles.cell}>
                    {item.coupon_start_date || "N/A"}
                  </Text>
                  <Text style={styles.cell}>
                    {item.coupon_end_date || "N/A"}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <Text>No student data matching filters</Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default FilteredReportPDF;
