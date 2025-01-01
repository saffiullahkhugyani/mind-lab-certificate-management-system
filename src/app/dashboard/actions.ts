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