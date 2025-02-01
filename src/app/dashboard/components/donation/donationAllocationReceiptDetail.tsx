import { Button } from "@/components/ui/button";
import { AllocatedProgramData, SponsorData } from "@/types/types";
import { Printer, Share } from "lucide-react";
import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";

interface DonationAllocationReceiptDetailProps {
  sponsorDetails: SponsorData | null;
  allocatedProgramData: AllocatedProgramData | null;
}

const DonationAllocationReceiptDetail = ({
  allocatedProgramData,
  sponsorDetails,
}: DonationAllocationReceiptDetailProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // print invoice
  const invoicePrint = useReactToPrint({ contentRef });

  // download invoice via pdf
  const handleDownloadPdf = async () => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: "a4",
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(
      `${allocatedProgramData?.program_name}-Receipt-${allocatedProgramData?.id}`
    );
  };

  return (
    <>
      <div className="flex justify-end p-2 space-x-2">
        <Button variant={"outline"} onClick={() => invoicePrint()}>
          <Printer />
        </Button>
        <Button variant={"outline"} onClick={handleDownloadPdf}>
          <Share />
        </Button>
      </div>
      <div className=" mx-auto bg-white border rounded-lg shadow-lg p-3">
        <div ref={contentRef} className="p-3">
          {/* Header */}
          <h1 className="text-2xl font-bold mb-4">Donation Allocation</h1>

          {/* Sponsor Info */}
          <div className="flex justify-between mb-6">
            <div>
              <p>
                <strong>Sponsor Name:</strong> {sponsorDetails?.name}
              </p>
              <p>
                <strong>Phone:</strong> {sponsorDetails?.number}
              </p>
            </div>
            <div className="text-right">
              <p>
                <strong>USERID:</strong> {sponsorDetails?.sponsor_id}
              </p>
              <p>
                <strong>ReceiptID:</strong> {allocatedProgramData?.id}
              </p>
            </div>
          </div>

          {/* Date */}
          <p className="text-right mb-6">
            <strong>Date:</strong> {allocatedProgramData?.created_at}
          </p>

          {/* Items Table */}
          <table className="w-full border-t border-b mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 text-left px-2">Program Name</th>
                <th className="py-2 text-left px-2">Program Period</th>
                <th className="py-2 text-center">Number of Coupons</th>
                <th className="py-2 text-right px-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr key={allocatedProgramData?.id} className="border-b">
                <td className="py-2 px-2">
                  {allocatedProgramData?.program_name}
                </td>
                <td className="py-2 px-2">{`${allocatedProgramData?.period}-Days`}</td>
                <td className="py-2 text-center">{`${Math.floor(
                  allocatedProgramData?.allocated_amount! /
                    Number(allocatedProgramData?.subscription_value)
                )}`}</td>
                <td className="py-2 text-right px-2">
                  ${allocatedProgramData?.allocated_amount!}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Details */}
          <p className="text-gray-600 mb-2">
            All donations are tax-deductible, currency is UAE.
          </p>
          <div className="text-right mt-6 ">
            {/* <p>
              <strong>Subtotal:</strong>$
              {allocatedProgramData?.allocated_amount}
            </p>
            <p className="text-xl font-bold mt-2">
              <strong>Total Amount:</strong>$
              {allocatedProgramData?.allocated_amount}
            </p> */}
            <p className="mt-2">
              <strong>Payment Method:</strong>
              {" card"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationAllocationReceiptDetail;
