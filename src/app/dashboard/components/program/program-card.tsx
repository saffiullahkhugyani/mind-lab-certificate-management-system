import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ProgramCardProps {
  image: string;
  title: string;
  description: string;
  donatedAmount: string;
  enrolled: boolean;
  detailsLink: string;
  isExpanded: boolean;
  onClick: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  image,
  title,
  description,
  donatedAmount,
  enrolled,
  detailsLink,
  isExpanded,
  onClick,
}) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("clicked");
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={onClick}
      className={`flex flex-col bg-white border border-gray-300 rounded-md shadow-md p-4 m-2 
        hover:cursor-pointer hover:bg-slate-200 transition-all duration-300
        ${
          isExpanded ? "col-span-4 grid grid-cols-4 gap-4 h-[400px]" : "h-full"
        }`}
    >
      {isExpanded ? (
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
              Donated amount: {donatedAmount}
            </p>
            <div className="flex-grow" />
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
            <a
              href={detailsLink}
              className="mt-6 text-right text-blue-500 text-sm font-medium block"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
            >
              {"more details on our website >>>"}
            </a>
          </div>
          <div className=" flex col-span-3 justify-center items-center justify-items-center bg-slate-300">
            Data
          </div>
        </>
      ) : (
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
          <p className="text-sm text-gray-700 font-medium mb-4">
            Donated amount: {donatedAmount}
          </p>
          <div className="flex-grow" />
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
          <a
            href={detailsLink}
            className="mt-6 text-right text-blue-500 text-sm font-medium block"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
          >
            {"more details on our website >>>"}
          </a>
        </>
      )}
    </div>
  );
};

export default ProgramCard;
