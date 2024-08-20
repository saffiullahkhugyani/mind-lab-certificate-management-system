import { Card } from "@/components/ui/card";
import { readUserSession } from "@/lib/actions/action";
import { createClient } from "@/lib/supabase/server";
import { UploadedCertificate } from "@/types/customs";
import { CustomUploadedCertificate } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getCertificateList() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const supabase = createClient();
  const { data: uploadedCertificates } = await supabase
    .from("upload_certificate")
    .select(`id, certificate_image_url ,profiles(*)`);

  return uploadedCertificates;
}

export default async function UploadedCertificates() {
  const { data: userSession } = await readUserSession();

  if (!userSession.session) {
    return redirect("/login");
  }

  const certificateList = await getCertificateList();
  return (
    <>
      <div className="w-full container mx-auto">
        <Card className="p-4">
          Total Certificates: {certificateList?.length}
        </Card>
      </div>

      <div className="w-full container mx-auto">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certificateList?.map((certificate) => (
            <CertificateCardItem key={certificate.id} {...certificate} />
          ))}
        </div>
      </div>
    </>
  );
}

function CertificateCardItem(props: CustomUploadedCertificate) {
  return (
    <Card className="w-full p-6 flex shadow-md hover:shadow-xl duration-200 transition-all">
      <Link href={`/uploaded-certificates/${props.id}`} className="h-full">
        <div className="flex flex-col items-start justify-between flex-1 h-full">
          <div className="flex flex-row space-x-2 mb-2 ">
            <Image
              src={props.certificate_image_url!}
              width={50}
              height={100}
              alt="Certificate Image"
            />
            <div className="flex flex-col">
              <h2 className="font-bold text-md">Certificate ID: {props.id}</h2>
              <span className="text-neutral-500 text-sm font-bold">
                Student Name: {props.profiles!.name}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
