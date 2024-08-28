import { Card } from "@/components/ui/card";
import { readUserSession } from "@/lib/actions/action";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CertificateCardItem from "./components/certificate-card-item";

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
