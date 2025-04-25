import { createClientReadOnly } from "../supabase/server";

export async function readUserSession() {
    const supabase = await createClientReadOnly();

    return supabase.auth.getSession();
}