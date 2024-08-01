import { createClient } from "@/lib/supabase/server";
import React from "react";

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = await createClient();
  return <div>Login</div>;
}
