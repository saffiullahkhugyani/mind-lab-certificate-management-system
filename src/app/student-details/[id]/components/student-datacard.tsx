import React from "react";

interface DetailsCardProps {
  title: string;
  value: number;
}

export default function StudentDetailCard({ title, value }: DetailsCardProps) {
  return (
    <div className=" flex flex-col items-center justify-items-center p-2 bg-gray-100 shadow-md rounded-sm font-bold ">
      <p className="text-sm">{title}</p>
      <p className="text-xl">{value}</p>
    </div>
  );
}
