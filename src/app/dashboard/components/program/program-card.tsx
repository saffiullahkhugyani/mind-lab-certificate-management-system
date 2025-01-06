import Image from "next/image";
import React from "react";

const ProgramCard: React.FC<{
  image: string;
  title: string;
  description: string;
  donatedAmount: string;
  enrolled: boolean;
  detailsLink: string;
}> = ({ image, title, description, donatedAmount, enrolled, detailsLink }) => {
  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-md shadow-md p-4 m-2 h-full">
      {/* Image Section */}
      <Image
        src={image}
        alt={title}
        width={100}
        height={100}
        className="h-40 w-full object-cover rounded-md mb-4"
      />
      {/* Title */}
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      {/* Donated Amount */}
      <p className="text-sm text-gray-700 font-medium mb-4">
        Donated amount: {donatedAmount}
      </p>
      {/* Spacer to push the button to the bottom */}
      <div className="flex-grow"></div>
      {/* Enrolled Button */}
      <button
        className={`py-1 px-3 text-sm font-bold rounded-md w-full ${
          enrolled
            ? "bg-black text-white"
            : "bg-gray-200 text-gray-700 border border-gray-300"
        }`}
      >
        {enrolled ? "Enrolled" : "Enroll"}
      </button>
      {/* Details Link */}
      <a
        href={detailsLink}
        className="mt-2 text-blue-500 text-sm font-medium text-center block"
        target="_blank"
        rel="noopener noreferrer"
      >
        more details on our website
      </a>
    </div>
  );
};

export default ProgramCard;
