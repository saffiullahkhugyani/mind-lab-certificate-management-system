"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CustomUploadedCertificate } from "@/types/types";
import { CaretSortIcon } from "@radix-ui/react-icons";
import React from "react";

function UploadedCertificates({
  uploadedCertificates,
  setCertificateUrl,
  setCertificateImageDisplay,
}: {
  uploadedCertificates: CustomUploadedCertificate[] | null;
  setCertificateUrl: React.Dispatch<
    React.SetStateAction<CustomUploadedCertificate | null>
  >;
  setCertificateImageDisplay: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedUrl, setSelectedUrl] = React.useState("");

  const handleOpenImageInNewWindow = (url: string) => {
    const newWindow = window.open("", "_blank", "width=800, height=600");
    if (newWindow) {
      newWindow.document.write(
        `<img src="${url}" alt="Certificate Image" style="max-width: 100%; height: auto;"/>`
      );
      newWindow.document.title = "Certificate Image";
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className=" space-y-2 bg-white shadow-md rounded-sm m-2 p-2"
    >
      <div className="flex items-center space-x-4 px-4">
        <h4 className="text-sm font-semibold">
          @total certificates to be asserted: {uploadedCertificates!.length}
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <CaretSortIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2 flex justify-center">
        <Carousel className="w-full max-w-lg">
          <CarouselContent>
            {uploadedCertificates!.map((certificate) => (
              <CarouselItem key={certificate.id}>
                <div
                  className="flex items-center justify-center aspect-square rounded-md border px-4 py-2 font-mono text-sm shadow-sm hover:bg-gray-200"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedUrl(certificate.certificate_image_url!);
                    setCertificateUrl(certificate);
                    setCertificateImageDisplay(true);
                    handleOpenImageInNewWindow(
                      certificate.certificate_image_url!
                    );
                  }}
                >
                  <span className="text-4xl font-semibold"></span>
                  <img
                    src={certificate.certificate_image_url!}
                    alt=" -Certificate Image"
                    width={250}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default UploadedCertificates;
