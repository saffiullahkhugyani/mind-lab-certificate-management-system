import { Button } from "@/components/ui/button";
import { Donation, SponsorData } from "@/types/types";
import { Printer, Share } from "lucide-react";
import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";

interface DonationReceiptDetailProps {
  sponsorDetails: SponsorData | null;
  donationReceipt: Donation | null;
}

const DonationReceiptDetail = ({
  donationReceipt,
  sponsorDetails,
}: DonationReceiptDetailProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // print invoice
  const invoicePrint = useReactToPrint({ contentRef });

  // downlaod and share
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
    pdf.save(`Donation Receipt-${donationReceipt?.donation_id}`);
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
          <h1 className="text-2xl font-bold mb-4">Donation Receipt</h1>

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
                <strong>ReceiptID:</strong> {donationReceipt?.donation_id}
              </p>
            </div>
          </div>

          {/* Date */}
          <p className="text-right mb-6">
            <strong>Date:</strong> {donationReceipt?.date}
          </p>

          {/* Items Table */}
          <table className="w-full border-t border-b mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 text-left px-2">Type</th>
                <th className="py-2 text-left px-2">Description</th>
                <th className="py-2 text-center">Qty.</th>
                <th className="py-2 text-right px-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr key={donationReceipt?.donation_id} className="border-b">
                <td className="py-2 px-2">{"Donation amount"}</td>
                <td className="py-2 px-2">
                  {donationReceipt?.donation_description}
                </td>
                <td className="py-2 text-center">{"1"}</td>
                <td className="py-2 text-right px-2">
                  ${donationReceipt?.amount!}
                </td>
              </tr>
              <tr key={donationReceipt?.bank_charges} className="border-b">
                <td className="py-2 px-2">{"Bank Charges"}</td>
                <td className="py-2 px-2"></td>
                <td className="py-2 text-center">{"1"}</td>
                <td className="py-2 text-right px-2">
                  ${donationReceipt?.bank_charges!}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Details */}
          <p className="text-gray-600 mb-2">
            All donations are tax-deductible, currency is UAE.
          </p>
          <div className="text-right">
            <p>
              <strong>Subtotal:</strong>$
              {donationReceipt?.amount! + donationReceipt?.bank_charges!}
            </p>
            <p className="text-xl font-bold mt-2">
              <strong>Total Amount:</strong>$
              {donationReceipt?.amount! + donationReceipt?.bank_charges!}
            </p>
            <p className="mt-2">
              <strong>Payment Method:</strong>
              {donationReceipt?.source_of_amount}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationReceiptDetail;
