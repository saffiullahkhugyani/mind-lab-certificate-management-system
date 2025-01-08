"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function emailLogin(data: {
    email: string,
    password: string,
}) {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword(data);
    
    if (error) {
        redirect('/login?message=Could not authenticate user')
    }
    revalidatePath('/', 'layout')
    redirect('/donation-management')
    
}

export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/login')
}