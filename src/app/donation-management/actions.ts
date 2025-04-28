"use server"

import { createClient } from "@/lib/supabase/server";
import { Donation, DonationAllocation, Programs, StudentSupport } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function sponsorList() {

  try {
    const supabase = await createClient();
    const { data: sponsers, error: sponsersError } = await supabase
      .from("sponsor")
      .select()
      .order("sponsor_id", { ascending: true });

    if (sponsersError) throw new Error(sponsersError.message);

    return { success: true, data: sponsers };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addSponsorDonation(formData: Donation) {

  try {

    const supabase = await createClient();
    const { remaining_amount, ...rest } = formData;
    const donationData = { ...rest, remaining_amount: rest.amount }

    const { data: donation, error: fetchError } = await supabase.from("donation")
      .insert(donationData)
      .select();

    console.log("Donation error:", fetchError);
    if (fetchError) {
      throw new Error("Failed to insert donations. Please try again later.");
    }

    revalidatePath("/donation-management")
    return { success: true, data: donation }

  } catch (error: any) {
    console.error("Error in donationAllocation:", error.message);
    return { success: false, error: error.message };
  }

}

export async function donationAllocation() {

  try {
    const supabase = await createClient();
    const { data: donationLog, error: donationLogError } = await supabase
      .from("donation_allocation_log")
      .select("id, allocated_amount, remaining_allocated_amount, donation!inner(sponsor!inner(*)), programs!inner(*), created_at")
      .order("id", { ascending: true });


    if (donationLogError) throw new Error(donationLogError.message);
    if (!donationLog) throw new Error("No record found for allocated");


    const donationAllocationInvoiceData = donationLog.map((log) => ({
      id: log.id,
      allocated_amount: log.allocated_amount,
      description: log.programs.description,
      subscription_value: log.programs.subscription_value,
      remaining_allocated_amount: log.remaining_allocated_amount,
      program_id: log.programs.program_id,
      club_id: log.programs.club_id,
      program_name: log.programs?.program_english_name,
      period: log.programs.period,
      created_at: new Date(log.created_at).toISOString().split("T")[0],
      sponsor: log.donation.sponsor,
    })
    )

    const { data: donationData, error: donationError } = await supabase
      .from("donation")
      .select("*, sponsor!inner(*)")
      .order("donation_id");

    if (donationError) throw new Error(donationError.message);
    if (!donationData) throw new Error("No donations found.");

    // revalidatePath("/donation-management")
    return {
      success: true, data: {
        donationInvoiceData: donationData,
        donationAllocationInvoiceData: donationAllocationInvoiceData,
      }
    }

  } catch (error: any) {
    console.error("Error in donationAllocation:", error.message);
    return { success: false, error: error.message };
  }

}

export async function studentCouponsReport() {
  try {
    const supabase = await createClient();

    const { data: couponDonationLink, error: couponDonationLinkError } = await supabase
      .from("coupon_donation_link")
      .select('coupons(*, programs!inner(*)), donation!inner(donation_id, sponsor!inner(*)), num_of_coupons');

    if (couponDonationLinkError) throw new Error(couponDonationLinkError.message);

    const { data: couponUserMapping, error: couponUserMappingError } = await supabase
      .from("coupon_student_mapping")
      .select("*, students!inner(id, name)");

    if (couponUserMappingError) throw new Error(couponUserMappingError.message);

    const { data: couponCodes, error: couponCodesError } = await supabase.from("coupon_codes")
      .select('*');

    if (couponCodesError) throw new Error(couponCodesError.message);

    const customList: StudentSupport[] = [];

    const processedEntries = new Set();

    couponDonationLink.forEach(donationData => {
      const couponId = donationData.coupons?.coupon_id;
      const couponStartDate = donationData.coupons?.start_date;
      const sponsorId = donationData.donation.sponsor.sponsor_id;
      const sponsorName = donationData.donation.sponsor.name;

      const matchingMappings = couponUserMapping.filter(
        mapping => mapping.coupon_id === couponId
      );

      const matchingCouponCode = couponCodes.filter(
        code => code.coupon_id === couponId
      );

      if (matchingMappings.length > 0) {
        for (let i = 0; i < matchingCouponCode.length; i++) {
          const couponCode = matchingCouponCode[i].coupon_code;
          const startDate = matchingCouponCode[i].start_date;
          const endDate = matchingCouponCode[i].end_date;

          if (couponCode) {
            matchingMappings.forEach(mapping => {
              const uniqueKey = `${mapping.student_id}-${couponId}-${couponCode}`;

              if (!processedEntries.has(uniqueKey)) {
                processedEntries.add(uniqueKey);

                customList.push({
                  student_id: mapping.student_id,
                  coupon_id: couponId!,
                  donation_id: donationData.donation.donation_id,
                  program_id: donationData.coupons?.program_id ?? null,
                  num_of_coupons: Number(donationData.coupons?.number_of_coupons),
                  couponStartDate: couponStartDate!,
                  coupon_duration: donationData.coupons?.coupon_duration,
                  coupon_start_date: startDate!,
                  coupon_end_date: endDate,
                  student_name: mapping.students?.name,
                  program_name: donationData.coupons?.programs.program_english_name,
                  coupon_code: couponCode!,
                  sponsor_id: sponsorId,
                  sponsor_name: sponsorName,
                });
              }
            });
          }
        }
      } else {
        customList.push({
          student_id: null,
          coupon_id: couponId!,
          donation_id: donationData.donation.donation_id,
          program_id: donationData.coupons?.program_id ?? null,
          num_of_coupons: donationData.num_of_coupons
        });
      }
    });


    return { success: true, data: customList };
  } catch (error: any) {

    console.error("Error in coupon report:", error.message);
    return { success: false, error: error.message };
  }
}

