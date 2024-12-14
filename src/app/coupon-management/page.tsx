import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GenerateCouponForm from "./components/generate-coupon-form";
import { StudentInterest } from "./components/student-interest";
import { clubsList, couponsList, programsList, studentsList } from "./actions";

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
          <TabsTrigger value="generate-coupon">Generate coupon</TabsTrigger>
          <TabsTrigger value="student-interest">Student Interest</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
