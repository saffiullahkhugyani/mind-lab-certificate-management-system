// import Image from "next/image";
// import React from "react";
// import styles from "../assign-student-certificate.module.css";
// import { Tag } from "@/types/types";

// interface CertificateProps {
//   certificate_name: string;
//   student_name: string;
//   program: string;
//   number_of_hours: string;
//   tags: Tag[];
//   date: string;
// }

// function Certificate({
//   student_name,
//   certificate_name,
//   program,
//   number_of_hours,
//   tags,
//   date,
// }: CertificateProps) {
//   console.log(number_of_hours);
//   return (
//     <div className="grid grid-cols-3 mx-auto bg-white shadow-md p-1 rounded-md m-2">
//       {/* Left Section - Certificate Design */}
//       <div className="col-span-1">
//         <Image
//           width={200}
//           height={500}
//           src={"/certificate-design.png"}
//           alt="Image"
//         />
//       </div>

//       {/* Right Section - Certificate Details */}
//       <div className="grid grid-rows-3 col-span-2 h-full">
//         {/* Header with QR Code and Logo */}
//         <div className="flex row-span-1 bg-slate-300 justify-between">
//           <div className="bg-slate-400 flex-1 flex items-center justify-center">
//             Div for QR code
//           </div>
//           <div className="flex-1 flex justify-end">
//             <Image width={100} height={100} src={"/stem-logo.jpg"} alt="logo" />
//           </div>
//         </div>

//         {/* Certificate Content */}
//         <div className="row-span-2 pl-4 flex flex-col h-full">
//           {/* Certificate Main Text */}
//           <div>
//             <p className={styles.headline}>CERTIFICATE OF EXCELLENCE</p>
//             <p className={styles.basictext}>is hereby granted to</p>

//             <h1 className={styles.name}>{student_name}</h1>
//             <h3 className={styles.basictext}>
//               for outstanding performance in <strong>{program}</strong> for{" "}
//             </h3>
//             <h3>
//               <strong>{number_of_hours} credit hours</strong>
//             </h3>
//             <h3>
//               <h3>
//                 Tags:
//                 <strong>{tags.toString()}</strong>
//               </h3>
//             </h3>
//           </div>

//           {/* Bottom Section - Pushes Instructor & Date Down */}
//           <div className="mt-auto flex justify-between items-center px-4 pb-4">
//             <div className="">
//               <p className="text-xs font-semibold mb-1">Khalid Lewis</p>
//               <p className="border-t border-black w-40 mx-auto"></p>
//               <p className="text-xs">INSTRUCTOR</p>
//             </div>
//             <div className="">
//               <p className="text-xs font-semibold mb-1">{date}</p>
//               <p className="border-t border-black w-40 mx-auto"></p>
//               <p className="text-xs">DATE</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Certificate;

import Image from "next/image";
import React, { useRef } from "react";
import styles from "../assign-student-certificate.module.css";
import { Tag } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Printer, Share } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import ReactDOM from "react-dom";
import { QRCodeSVG } from "qrcode.react";
interface CertificateProps {
  certificate_name: string;
  student_id: string;
  student_name: string;
  program: string;
  number_of_hours: string;
  tags: Tag[];
  date: string;
}

const Certificate: React.FC<CertificateProps> = ({
  student_name,
  student_id,
  certificate_name,
  program,
  number_of_hours,
  tags,
  date,
}) => {
  // Extract only tag names from the Tag[] list
  const tagNames = tags.map((tag) => tag.tag_name).join(", ");
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
    pdf.save(`${student_name}-Certificate-of-${program}`);
  };

  // const StudentId = "1f698458-55f0-49cd-ad3a-ecc64bf146c2";
  {
    /*Development link*/
  }
  // const profileLink = `http://localhost:3000/student-details/${student_id}`;

  {
    /*Production link*/
  }
  const profileLink = `https://admin-cms-app.netlify.app/student-details/${student_id}`;
  console.log(profileLink);

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
      <div className="mx-auto shadow-lg w-[700px]">
        <div
          ref={contentRef}
          className="grid grid-cols-3 mx-auto border bg-white p-2 rounded-md m-2 w-[700px]"
        >
          {/* Left Section - Certificate Design */}
          <div className="col-span-1">
            <Image
              width={200}
              height={500}
              src="/certificate-design.png"
              alt="Certificate Design"
            />
          </div>

          {/* Right Section - Certificate Details */}
          <div className="grid grid-rows-3 col-span-2 h-full">
            {/* Header with QR Code and Logo */}
            <div className="flex row-span-1 justify-between p-2">
              <div className="flex-1 flex items-center pl-2">
                {<QRCodeSVG value={profileLink} />}
              </div>
              <div className="flex-1 flex justify-end">
                <Image
                  width={100}
                  height={100}
                  src="/stem-logo.jpg"
                  alt="STEM Logo"
                />
              </div>
            </div>

            {/* Certificate Content */}
            <div className="row-span-2 pl-4 flex flex-col h-full">
              <div>
                <p className={styles.headline}>CERTIFICATE OF EXCELLENCE</p>
                <p className={styles.basictext}>is hereby granted to</p>
                <h1 className={styles.name}>{student_name}</h1>
                <h3 className={styles.basictext}>
                  for outstanding performance in <strong>{program}</strong>
                </h3>
                <h3>
                  <strong>{number_of_hours} credit hours</strong>
                </h3>
                <h3>
                  Tags: <strong>{tagNames}</strong>
                </h3>
              </div>

              {/* Bottom Section - Instructor & Date */}
              <div className="mt-auto flex justify-between items-center px-4 pb-4">
                <div className="">
                  <p className="text-xs font-semibold mb-1">Khalid Lewis</p>
                  <p className="border-t border-black w-40 mx-auto"></p>
                  <p className="text-xs mt-1">INSTRUCTOR</p>
                </div>
                <div className="">
                  <p className="text-xs font-semibold mb-1">{date}</p>
                  <p className="border-t border-black w-40 mx-auto"></p>
                  <p className="text-xs mt-1">DATE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;
