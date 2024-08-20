import { Card } from "@/components/ui/card";
import { readUserSession } from "@/lib/actions/action";
import { createClient } from "@/lib/supabase/server";
import { CustomUploadedCertificate } from "@/types/types";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UploadedCertificates({
  params,
}: {
  params: { certificateId: string };
}) {
  const supabase = createClient();
  const { data: userSession } = await readUserSession();

  if (!userSession.session) {
    return redirect("/login");
  }

  const { certificateId } = params;

  const { data } = await supabase
    .from("upload_certificate")
    .select(`id, certificate_image_url ,profiles(*)`)
    .eq("id", certificateId)
    .single();

  return (
    <div className="w-full container mx-auto">
      <div className="flex flex-col items-center h-full">
        <Card className="flex flex-row items-center p-4 gap-4 space-x-2 m-2 bg-blue-200">
          <Image
            src={data?.certificate_image_url!}
            alt="Certificate Image"
            width={200}
            height={100}
          />
          <div className="flex flex-col">
            <h2 className="font-bold text-md">Certificate ID: {data?.id}</h2>
            <span className="text-neutral-500 text-sm">
              Student Name: {data?.profiles?.name}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
