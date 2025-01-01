import React from "react";

interface DetailsCardProps {
  title: string;
  value: string;
}

export default function DetailsCard({ title, value }: DetailsCardProps) {
  return (
    <div className=" flex flex-col items-center justify-items-center p-4 bg-gray-100 shadow-md rounded-sm font-bold text-xl">
      <p>{title}</p>
      <p>{value}</p>
    </div>
  );
}
