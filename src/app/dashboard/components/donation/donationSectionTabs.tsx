import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DonationReceipt from "./donationReceipt";
import { Donation, SponsorData } from "@/types/types";
import { Sponsor } from "@/types/customs";
import DonationAllocation from "./donationAllocation";

interface DonationSectionProps {
  sponsorDetails: SponsorData | null;
  donationData: Donation[] | null;
}

export default function DonationSectionTabs({
  donationData,
  sponsorDetails,
}: DonationSectionProps) {
  console.log(donationData);

  return (
    <div>
      {/* Tabs for Donation Receipt and Donation Allocation */}
      <Tabs defaultValue="receipt" className="w-full">
        {/* Tabs Navigation */}
        <TabsList className="flex">
          <TabsTrigger value="receipt">Donation Receipt</TabsTrigger>
          <TabsTrigger value="allocation">Donation Allocation</TabsTrigger>
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
            <DonationAllocation
              donationReceipt={donationData!}
              sponsorDetails={sponsorDetails!}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
