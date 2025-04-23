import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AllocatedProgramData,
  Donation,
  SponsorData,
  StudentSupport,
} from "@/types/types";
import DonationReceipt from "./donation_receipt";
import DonationAllocationReceipt from "./donation_allocation_receipt";
import { DataTable } from "./coupons_report_data_table";
import { columns } from "./coupons_report_columns";
interface DonationReceiptProps {
  sponsorDetails: SponsorData | null;
  donationData: Donation[] | null;
  allocatedProgramData: AllocatedProgramData[] | null;
  supportStudentData?: StudentSupport[] | null;
}

export default function OverviewReportTabs({
  donationData,
  sponsorDetails,
  allocatedProgramData,
  supportStudentData,
}: DonationReceiptProps) {
  return (
    <div className="bg-white">
      {/* Tabs for Donation Receipt and Donation Allocation */}
      <Tabs defaultValue="receipt" className="w-full">
        {/* Tabs Navigation */}
        <TabsList className="flex border-primary" variant={"underline"}>
          <TabsTrigger
            value="receipt"
            variant={"underline"}
            className=" text-lg data-[state=active]:bg-[#007847] text-black font-bold data-[state=active]:text-white"
          >
            Donation Receipt
          </TabsTrigger>
          <TabsTrigger
            value="allocation"
            variant={"underline"}
            className=" text-lg data-[state=active]:bg-[#007847] text-black font-bold data-[state=active]:text-white"
          >
            Donation Allocation
          </TabsTrigger>
          <TabsTrigger
            value="coupons-report"
            variant={"underline"}
            className=" text-lg data-[state=active]:bg-[#007847] text-black font-bold data-[state=active]:text-white"
          >
            Coupons Report
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="receipt">
          <div className="mt-4">
            {/* Render the Donation Receipt Component */}
            <DonationReceipt
              donationReceipt={donationData!}
              sponsorDetails={sponsorDetails!}
            />
          </div>
        </TabsContent>

        <TabsContent value="allocation">
          <div className="mt-4">
            {/* Render the Donation Allocation Component */}
            <DonationAllocationReceipt
              allocatedProgramData={allocatedProgramData!}
              sponsorDetails={sponsorDetails!}
            />
          </div>
        </TabsContent>
        <TabsContent value="coupons-report">
          <div className="mt-4">
            {/* Render the Donation Allocation Component */}
            <DataTable columns={columns} data={supportStudentData!} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
