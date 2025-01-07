"use server"

import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns";

export async function studentList() {
    const supabase = createClient()
    
    try { 
        const { data: studentList, error: studentListError } = await supabase
            .from("profiles")
            .select("*");
        
        if (studentListError) throw new Error(studentListError.message);

        return {success: true, data: studentList}

    } catch (error: any) {
        return {success:false, error: error.message}
    }
    
}

export async function clubList() {
    const supabase = createClient()
    
    try { 
        const { data: clubList, error: clubListError } = await supabase
            .from("clubs")
            .select("*");
        
        if (clubListError) throw new Error(clubListError.message);

        return {success: true, data: clubList}

    } catch (error: any) {
        return {success:false, error: error.message}
    }
    
}

export async function programList() {
    const supabase = createClient()
    
    try { 
        const { data: programList, error: programListError } = await supabase
            .from("programs")
            .select("*");
        
        if (programListError) throw new Error(programListError.message);

        return {success: true, data: programList}

    } catch (error: any) {
        return {success:false, error: error.message}
    }
    
}

export default async function sponsorData() {
    const supabase = createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;
    try {

        const { data: sponsorData, error: sponsorError } = await supabase
            .from("sponsor")
            .select("*, profiles (profile_image_url)")
            .eq("user_id",  userId!)
            .single();
        
        if (sponsorError) throw new Error(sponsorError.message);
        if (!sponsorData) throw new Error("Sponsor not found.");

        const { data: donationData, error: donationError } = await supabase
            .from("donation")
            .select("*")
            .eq("sponsor_id", sponsorData.sponsor_id);
        
        if (donationError) throw new Error(donationError.message);
        if (!donationData) throw new Error("No donations found.");
        
        // calculate the total donation amount
        const totalDonationAmount = donationData?.reduce(
            (sum, donation) => sum + (donation.amount || 0),
            0
        ) || 0;

        // calculate total remaining amount
        const totalRemainingDonation = donationData?.reduce(
            (sum, donation) => sum + (donation.remaining_amount || 0),
            0
        ) || 0;

        const { data: donationLog, error: donationLogError } = await supabase
            .from("donation_allocation_log")
            .select("id, allocated_amount, remaining_allocated_amount, donation!inner(sponsor!inner(*)), programs!inner(*), created_at")
            .eq("donation.sponsor.user_id", userId!)
        
        if (donationLogError) throw new Error(donationLogError.message);
        if (!donationLog) throw new Error("No record found for allocated");

        console.log("Data for sponsor",
            donationLog!.map((log) => ({
                allocated_amount: log.allocated_amount,
                remaining_allocated_amount: log.remaining_allocated_amount,
                program_name: log.programs?.program_english_name,
                created_at: new Date(log.created_at).toISOString().split("T")[0],
            }))
        );
        const shapedAllocatedProgramData = donationLog!.map((log) => ({
            id: log.id,
            allocated_amount: log.allocated_amount,
            subscription_value: log.programs.subscription_value,
            remaining_allocated_amount: log.remaining_allocated_amount,
            program_id: log.programs.program_id,
            club_id: log.programs.club_id,
            program_name: log.programs?.program_english_name,
            period: log.programs.period,
            created_at: new Date(log.created_at).toISOString().split("T")[0],

             
        }))
        
        const shapedSponsorData = {
            sponsor_id: sponsorData.sponsor_id,
            name: sponsorData.name,
            email: sponsorData.email,
            number: sponsorData.phone_number,
            image: sponsorData.profiles?.profile_image_url,
            totalDonationAmount: totalDonationAmount,
            totalRemainingDonation: totalRemainingDonation,
            allocatedDonation: totalDonationAmount - totalRemainingDonation,
            programs_funded: donationLog?.length,
        }

        return {
            success: true, data: {
                sponsorData: shapedSponsorData,
                allocatedProgramData: shapedAllocatedProgramData,
                donataionsData: donationData
            }
        };


     } catch(error:any) {
        console.log("Error in sponsor data:", error.message);
        return { success: false, error: error.message };
    }
}