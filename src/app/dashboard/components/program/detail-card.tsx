import React from "react";

interface DetailsCardProps {
  title?: string;
  value?: string;
  valueCheck?: boolean;
  donatedAmount?: string;
  remainingAmount?: string;
  programSubsrciptionValue?: string;
  programEnrolledDate?: string;
  type?: string;
  couponLastExpiryDate?: string;
}

export default function DetailsCard({
  title,
  value,
  valueCheck = false,
  type,
  donatedAmount,
  remainingAmount,
  programSubsrciptionValue,
  programEnrolledDate,
  couponLastExpiryDate,
}: DetailsCardProps) {
  return (
    <div className=" m-2 p-1 bg-gray-100 shadow-md rounded-sm ">
      {type === "donatedAmount" && (
        <>
          <p className="font-bold text-sm">{title}</p>
          <p className="font-bold text-3xl">{`$${donatedAmount}`}</p>
        </>
      )}
      {type === "remainingAmount" && (
        <>
          <p className="font-bold text-sm">{title}</p>
          <p className="font-bold text-3xl">{`$${remainingAmount}`}</p>
        </>
      )}
      {type === "couponStatistics" && (
        <>
          <p className="font-bold text-md">{title}</p>
          <p className="text-sm">
            Total coupons issued:
            <strong>{` ${Math.round(
              Number(donatedAmount) / Number(programSubsrciptionValue)
            )}`}</strong>
          </p>
          <p className=" text-sm">
            Coupons used:
            <strong>
              {`${Math.round(
                (Number(donatedAmount) - Number(remainingAmount)) /
                  Number(programSubsrciptionValue)
              )} out of ${Math.round(
                Number(donatedAmount) / Number(programSubsrciptionValue)
              )}`}
            </strong>
          </p>
        </>
      )}
      {type === "importantDates" && (
        <>
          <p className="font-bold text-md">{title}</p>
          <p className=" text-sm">
            Coupon Enrolled:
            <strong>
              {` ${new Date(programEnrolledDate!).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}`}
            </strong>
          </p>
          <p className="text-sm">
            Coupon Expiration:
            <strong>{`${couponLastExpiryDate}`}</strong>
          </p>
          {/* <p className="font-bold text-sm">{`Coupons used ${Math.round(
            (Number(donatedAmount) - Number(remainingAmount)) /
              Number(programSubsrciptionValue)
          )} out of ${Math.round(
            Number(donatedAmount) / Number(programSubsrciptionValue)
          )}`}</p> */}
        </>
      )}
    </div>
  );
}
