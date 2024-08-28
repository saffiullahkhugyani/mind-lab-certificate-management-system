import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { CustomUploadedCertificate } from "@/types/types";

export default function CertificateCardItem(props: CustomUploadedCertificate) {
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
