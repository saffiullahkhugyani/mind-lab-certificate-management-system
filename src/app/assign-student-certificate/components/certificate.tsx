import Image from "next/image";
import React from "react";
import styles from "../assign-student-certificate.module.css";

function Certificate() {
  return (
    <div className="grid grid-cols-3 mx-auto bg-white shadow-md p-1 rounded-md m-2">
      {/* Left Section - Certificate Design */}
      <div className="col-span-1">
        <Image
          width={200}
          height={500}
          src={"/certificate-design.png"}
          alt="Image"
        />
      </div>

      {/* Right Section - Certificate Details */}
      <div className="grid grid-rows-3 col-span-2 h-full">
        {/* Header with QR Code and Logo */}
        <div className="flex row-span-1 bg-slate-300 justify-between">
          <div className="bg-slate-400 flex-1 flex items-center justify-center">
            Div for QR code
          </div>
          <div className="flex-1 flex justify-end">
            <Image width={100} height={100} src={"/stem-logo.jpg"} alt="logo" />
          </div>
        </div>

        {/* Certificate Content */}
        <div className="row-span-2 pl-4 flex flex-col h-full">
          {/* Certificate Main Text */}
          <div>
            <p className={styles.headline}>CERTIFICATE OF EXCELLENCE</p>
            <p className={styles.basictext}>is hereby granted to</p>

            <h1 className={styles.name}>Saffiullah Khugyani</h1>
            <h3 className={styles.basictext}>
              for outstanding performance in <strong>PROGRAM</strong> for{" "}
            </h3>
            <h3>
              <strong>30 credit hours</strong>
            </h3>
            <h3>
              <strong>Tags</strong>
            </h3>
          </div>

          {/* Bottom Section - Pushes Instructor & Date Down */}
          <div className="mt-auto flex justify-between items-center px-4 pb-4">
            <div className="">
              <p className="border-t border-black w-40 mx-auto"></p>
              <p className="text-xs font-semibold mt-1">Khalid Lewis</p>
              <p className="text-xs">INSTRUCTOR</p>
            </div>
            <div className="">
              <p className="border-t border-black w-40 mx-auto"></p>
              <p className="text-xs font-semibold mt-1">January 20, 2025</p>
              <p className="text-xs">DATE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
