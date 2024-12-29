"use server"

import { createClient } from "@/lib/supabase/server"

export async function updatePassword(data: {
    password: string,
    confirmPassword: string,
    accessToken: string,
    refreshToken: string,
}) {

    const supabase = createClient();

    try {
        const { accessToken, refreshToken } = data;

        if (!accessToken || !refreshToken) {
            throw new Error("Missing access token")
        }

        // Set the session using the access token
        const { data: session, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
        });

        if (sessionError) {
            throw new Error("Failed to set the session");
        }

        // // optional validate user accessToken
        // const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

        // if (userError) throw new Error(userError.message);

        const { data: resetData, error: resetError } = await supabase
            .auth
            .updateUser({ password: data.password })
        
        if (resetData) {
            console.log(resetData);

            const { error: logoutError } = await supabase.auth.signOut();

            if (logoutError) throw new Error(logoutError.message);

            return {success: true, data: resetData}
        }
        if (resetError) { 
            console.log(resetError);
            throw new Error(resetError.message)
        }

    } catch (error: any) {
        return { success: false, error: error || "An unexpected error occurred." };
    }

}