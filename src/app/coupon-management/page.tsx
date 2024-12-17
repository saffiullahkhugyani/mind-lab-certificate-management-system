import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GenerateCouponForm from "./components/generate-coupon-form";
import { StudentInterest } from "./components/student-interest";
import { clubsList, couponsList, programsList, studentsList } from "./actions";
// import CouponBatchProcess from "./components/coupon-batch-process";

export default async function Page() {
  const clubs = await clubsList();
  const programs = await programsList();
  const students = await studentsList();
  const coupons = await couponsList();

  return (
    <div className="p-6 space-x-3 bg-gray-100 w-full">
      <h1 className="text-2xl font-semibold mb-6">Coupon Management</h1>

      {/* Tabs */}
      <Tabs
        defaultValue="generate-coupon"
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="generate-coupon">Generate Coupon</TabsTrigger>
          <TabsTrigger value="student-interest">Student Interest</TabsTrigger>
          {/* <TabsTrigger value="coupon-batch-process">
            Coupon Batch Process
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="generate-coupon">
          <GenerateCouponForm
            clubs={clubs.data!}
            programs={programs}
            studentProfiles={students.data!}
          />
        </TabsContent>

        <TabsContent value="student-interest">
          <StudentInterest
            students={students.data!}
            clubs={clubs.data!}
            programs={programs!}
          />
        </TabsContent>

        {/* <TabsContent value="coupon-batch-process">
          <CouponBatchProcess />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
