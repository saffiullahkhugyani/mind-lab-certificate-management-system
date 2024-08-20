import { createClientReadOnly } from "../supabase/server";

export async function readUserSession() {
    const supabase =  createClientReadOnly();

    return supabase.auth.getSession();
}