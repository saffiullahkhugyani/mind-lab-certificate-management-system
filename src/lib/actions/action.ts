import { createSupabaseServerClientReadOnly } from "../supabase/server";

export async function readUserSession() {
    const supabase =  createSupabaseServerClientReadOnly();

    return supabase.auth.getSession();
}