"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function emailLogin(data: {
    email: string,
    password: string,
}) {
    const supabase = createSupabaseServerClient();

    const { error } = await supabase.auth.signInWithPassword(data);
    
    if (error) {
        redirect('/login?message=Could not authenticate user')
    }
    revalidatePath('/', 'layout')
    redirect('/dashboard')
    
}

export async function signOut() {
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/login')
}