"use server"

import { createClient } from "@/lib/supabase/server";
import { Certificate } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function addCertificate(formData: Certificate) {
  const supabase = createClient();
   const { id, ...rest } = formData;
  const certificateData = id === null ? rest : formData;

  const { data, error } = await supabase.from("certificate_master").insert(certificateData).select();

  revalidatePath("/create-certificate")

  return data;

}
