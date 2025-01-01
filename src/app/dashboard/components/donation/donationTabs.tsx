import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DonationReceipt from "./donationReceipt";

const DonationScreen = () => {
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
            <DonationReceipt />
          </div>
        </TabsContent>

        <TabsContent value="allocation">
          <div className="mt-4">
            {/* Render the Donation Allocation Component */}
            {/* <DonationAllocation /> */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DonationScreen;
