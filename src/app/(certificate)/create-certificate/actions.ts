"use server"

import { createClient } from "@/lib/supabase/server";
import { Certificate } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function addCertificate(formData: Certificate) {
  const supabase = createClient();
   const { id, ...rest } = formData;
  const certificateData = id === null ? rest : formData;

  const { data, error } = await supabase.from("certificate_master").insert(certificateData).select();

  if (data != null)
  {

    console.log("data interted to certificate master: ",data);
  } else {
    console.log("Error inserting data into certificate master: ",error)
  }

  revalidatePath("/create-certificate")

  return data;

}

export async function updateCertificate(formData: Certificate) {
  const supabase = createClient();
   const { id, ...rest } = formData;
  const certificateData = id === null ? rest : formData;

  const { data, error } = await supabase.from("certificate_master").update(certificateData).eq("id", formData.id!).select();

  if (data != null)
  {

    console.log("data updated to certificate master: ",data);
  } else {
    console.log("Error updating data into certificate master: ",error)
  }

  revalidatePath("/create-certificate")

  return data;

}

export async function addCertificateMapping({userId, certificateV1Id, certificateV2Id}: {userId: string, certificateV1Id: string, certificateV2Id: string}) {
  const supabase = createClient();

  const { data, error } = await supabase.from("certificate_v1_v2_mapping")
    .insert({ user_id: userId ,v1_certificate_id: certificateV1Id, v2_certificate_id: certificateV2Id }).select();

  if (data != null) {
    console.log("Data inserted into v1 and v2 mapping: " , data);
  } else {
    console.log("Error inserting data into v1 and v2 mapping: ", error);
    }
  
  revalidatePath("/create-certificate")

  return data;
}

export async function certificateAsserted({ certificateV1Id }: { certificateV1Id: string }) {

  const supabase = createClient();

  const { data, error } = await supabase.from("upload_certificate").update({ certificate_asserted: "1" }).eq("id", certificateV1Id).select();
  

  if (data != null) {
    console.log("Certificate Asserted: " , data);
  } else {
    console.log("Certificaete Assertion error: ", error);
  }
  
  return data;
}
