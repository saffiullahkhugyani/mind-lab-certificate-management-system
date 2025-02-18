import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DonationReceipt from "./donationReceipt";
import { AllocatedProgramData, Donation, SponsorData } from "@/types/types";
import DonationAllocationReceipt from "./donationAllocationReceipt";

interface DonationReceiptProps {
  sponsorDetails: SponsorData | null;
  donationData: Donation[] | null;
  allocatedProgramData: AllocatedProgramData[] | null;
}

export default function DonationReceiptTabs({
  donationData,
  sponsorDetails,
  allocatedProgramData,
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
      </Tabs>
    </div>
  );
}
