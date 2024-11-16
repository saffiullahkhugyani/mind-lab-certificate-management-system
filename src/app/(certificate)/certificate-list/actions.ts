"use server"

import { createClient } from "@/lib/supabase/server";
import { Certificate } from "@/types/types";
import { revalidatePath } from "next/cache"

export async function switchCertificateState(certificateId: String, value: boolean) {
  const supabase = createClient();
  
  const certificateStatus = {certificate_status: value}
    
    const { data, error } = await supabase.from("certificate_master").
        update(certificateStatus).eq("id", certificateId).select();
    
    if (data != null)
  {

    console.log("Status changed: ",data);
  } else {
    console.log("Error changing status: ",error)
  }

  revalidatePath("/certificate-list")

  return data;

}