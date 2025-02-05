import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import DetailsCard from "./detail-card";
import ProgramTimelineChart from "./programs-data-chart";

interface ProgramCardProps {
  image: string;
  title: string;
  description: string;
  donatedAmount: string;
  remaingAmount: string;
  programSubsrciptionValue: string;
  programEnrolledDate: string;
  enrolled: boolean;
  detailsLink: string;
  isExpanded: boolean;
  onClick: () => void;
  numOfAllocations: number;
  couponLastExpiryDate?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  image,
  title,
  description,
  donatedAmount,
  remaingAmount,
  programSubsrciptionValue,
  programEnrolledDate,
  enrolled,
  detailsLink,
  isExpanded,
  onClick,
  numOfAllocations,
  couponLastExpiryDate,
}) => {
  const handleButtonClick = (e: React.MouseEvent) => e.stopPropagation();
  const handleLinkClick = (e: React.MouseEvent) => e.stopPropagation();

  const enrollmentButton = (
    <Button
      onClick={handleButtonClick}
      variant="ghost"
      className={`py-1 px-3 text-sm font-bold rounded-md w-full ${
        enrolled
          ? "bg-black text-white"
          : "bg-gray-200 text-gray-700 border border-gray-300"
      }`}
    >
      {enrolled ? "Enrolled" : "Enroll"}
    </Button>
  );

  const detailsLinkComponent = (
    <a
      href={detailsLink}
      className="mt-6 text-right text-blue-500 text-sm font-medium block"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleLinkClick}
    >
      {"more details on our website >>>"}
    </a>
  );

  return (
    <div
      onClick={onClick}
      className={`flex flex-col bg-white border border-gray-300 rounded-md shadow-md p-4 m-2 
        hover:cursor-pointer hover:bg-slate-200 transition-all duration-300
        ${isExpanded ? "col-span-4 grid grid-cols-4 gap-4 mt-4" : "h-full"}`}
    >
      {isExpanded ? (
        <ExpandedView
          image={image}
          title={title}
          description={description}
          donatedAmount={donatedAmount}
          remaingAmount={remaingAmount}
          programSubsrciptionValue={programSubsrciptionValue}
          programEnrolledDate={programEnrolledDate}
          enrollmentButton={enrollmentButton}
          detailsLinkComponent={detailsLinkComponent}
          couponLastExpiryDate={couponLastExpiryDate}
        />
      ) : (
        <CollapsedView
          image={image}
          title={title}
          description={description}
          donatedAmount={donatedAmount}
          numOfAllocations={numOfAllocations}
          enrollmentButton={enrollmentButton}
          detailsLinkComponent={detailsLinkComponent}
        />
      )}
    </div>
  );
};

const ExpandedView: React.FC<any> = ({
  image,
  title,
  description,
  donatedAmount,
  remaingAmount,
  programSubsrciptionValue,
  programEnrolledDate,
  enrollmentButton,
  detailsLinkComponent,
  couponLastExpiryDate,
}) => (
  <>
    <div className="col-span-1">
      <Image
        src={image}
        alt={title}
        width={100}
        height={100}
        className="h-40 w-full object-cover rounded-md mb-4"
      />
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <p className="text-sm text-gray-700 font-medium mb-4">
        Accumulated donation amount: {donatedAmount}
      </p>
      {enrollmentButton}
      {detailsLinkComponent}
    </div>
    <div className="grid grid-rows-4 col-span-3">
      <div className="flex justify-center row-span-1 m-1">
        <DetailsCard
          title="Program donation amount"
          donatedAmount={donatedAmount}
          type="donatedAmount"
        />
        <DetailsCard
          title="Donation to be allocated"
          remainingAmount={remaingAmount}
          type="remainingAmount"
        />
        <DetailsCard
          title="Coupon Statistics"
          type="couponStatistics"
          remainingAmount={remaingAmount}
          donatedAmount={donatedAmount}
          programSubsrciptionValue={programSubsrciptionValue}
        />
        <DetailsCard
          title="Important Dates"
          type="importantDates"
          programEnrolledDate={programEnrolledDate}
          couponLastExpiryDate={couponLastExpiryDate}
        />
      </div>
      <div className="flex row-span-3 justify-center items-center m-1 bg-slate-100">
        <ProgramTimelineChart />
      </div>
    </div>
  </>
);

const CollapsedView: React.FC<any> = ({
  image,
  title,
  description,
  donatedAmount,
  numOfAllocations,
  enrollmentButton,
  detailsLinkComponent,
}) => (
  <>
    <Image
      src={image}
      alt={title}
      width={100}
      height={100}
      className="h-40 w-full object-cover rounded-md mb-4"
    />
    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    <p className="text-sm text-gray-600 mb-4">{description}</p>
    <p className="text-sm text-gray-700 font-medium">
      Accumulated donated amount: {donatedAmount}
    </p>
    <p className="text-sm text-gray-700 font-medium mb-4">
      Number of allocations: {numOfAllocations}
    </p>
    {enrollmentButton}
    {detailsLinkComponent}
  </>
);

export default ProgramCard;
