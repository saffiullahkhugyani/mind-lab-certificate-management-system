"use server"

import { createClient } from "@/lib/supabase/server";
import { Donation, DonationAllocation, Programs } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function sponsorList() {

  try {
    const supabase = createClient();
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

    const supabase = createClient();
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
    const supabase = createClient();
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

