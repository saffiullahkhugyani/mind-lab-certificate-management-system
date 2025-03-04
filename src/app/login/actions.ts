"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * Handles user login via email and password.
 * @param data - An object containing the user's email and password.
 * @throws Redirects to the login page with an error message if authentication fails.
 */
export async function emailLogin(data: { email: string; password: string }) {
    const supabase = createClient();

    try {
        const { error } = await supabase.auth.signInWithPassword(data);

        if (error) {
            console.error("Authentication error:", error.message);
            redirect("/login?message=Could not authenticate user");
        }

        // Optionally revalidate the home page cache if needed
        // revalidatePath('/', 'layout');

    } catch (error) {
        console.error("Unexpected error during login:", error);
        redirect("/login?message=An unexpected error occurred");
    }

    // redirect to donation management
    redirect("/donation-management");
}

/**
 * Handles user sign-out.
 * @throws Redirects to the login page after signing out.
 */
export async function signOut() {
    const supabase = createClient();

    try {
        await supabase.auth.signOut();
    } catch (error) {
        console.error("Error during sign-out:", error);
        redirect("/login?message=An error occurred during sign-out");
    }

    //  Redirect to  the login page after successful sign-out
    redirect("/login");
}