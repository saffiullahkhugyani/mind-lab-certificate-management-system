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
    
    if (fetchError) {
      throw new Error("Failed to insert donations. Please try again later.");
    }

    revalidatePath("/donation-management")
    return {success: true, data: donation}
  
  } catch (error: any) {
    console.error("Error in donationAllocation:", error.message);
    return { success: false, error: error.message };
  }

}
