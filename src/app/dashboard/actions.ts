"use server"

import { createClient } from "@/lib/supabase/server"

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
            .select("id, allocated_amount, remaining_allocated_amount, donation!inner(sponsor!inner(*)), programs!inner(program_id, program_english_name), created_at")
            .eq("donation.sponsor.user_id", userId!)
        
        if (donationLogError) throw new Error(donationLogError.message);
        if (!donationLog) throw new Error("No record found for allocated");

        // const tempMap = donationLog!.map((log) => ({
        //     allocated_amount: log.allocated_amount,
        //     user_id: log.donation.sponsor.user_id,
        //     sponsor_id: log.donation.sponsor.sponsor_id,
        //     sponsor_name: log.donation?.sponsor?.name, // Accessing the nested name
        //     program_id: log.programs.program_id,
        //     program_name: log.programs?.program_english_name,
        //     created_at: log.created_at,
        // }));

        // const donationLogMap = tempMap.reduce((acc, current) => {
        //     const { program_id, allocated_amount, ...rest } = current;
            
        //     if (acc.has(program_id)) {
        //         // Update the existing program data
        //         const existing = acc.get(program_id)!; // Get existing entry
        //         existing.allocated_amount += allocated_amount;
        //     } else {
        //         // add a new entry
        //         acc.set(program_id, { ...rest, program_id, allocated_amount });
        //     }
            
        //     return acc;
        // }, new Map());

        // console.log("testing the logic", donationLogMap.values());

        // console.log("Data for sponsor",
        //     donationLog!.map((log) => ({
        //         allocated_amount: log.allocated_amount,
        //         remaining_allocated_amount: log.remaining_allocated_amount,
        //         program_name: log.programs?.program_english_name,
        //         created_at: new Date(log.created_at).toDateString(),
        //     }))
        // );
        const shapredAllocatedProgramData =  donationLog!.map((log) => ({
                allocated_amount: log.allocated_amount,
                remaining_allocated_amount: log.remaining_allocated_amount,
                program_name: log.programs?.program_english_name,
                created_at: new Date(log.created_at).toDateString(),
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
                allocatedProgramData: shapredAllocatedProgramData,
                donataionsData: donationData
            }
        };


     } catch(error:any) {
        console.log("Error in sponsor data:", error.message);
        return { success: false, error: error.message };
    }
}