import { useState } from "react";

type Donation = {
  id: string;
};

interface DonataionDataProps {
  donation: Donation[];
}

const DonationSearchSection = ({ donation }: DonataionDataProps) => {
  const [selectedDonation, setSelectedDonation] = useState<string>("");

  const handleSelectDonation = (donationId: string) => {
    setSelectedDonation(donationId);
  };

  return (
    <div className="grid grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow-md">
      {/* Sidebar */}
      <div className="col-span-1 border-r pr-4">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Donation Receipt
        </h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Invoice..."
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Date Filter */}
        <div className="flex mb-6 gap-2">
          <input
            type="date"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Donation IDs */}
        <div className="space-y-2">
          {donation.map((donation) => (
            <button
              key={donation.id}
              onClick={() => handleSelectDonation(donation.id)}
              className={`flex items-center justify-between w-full p-3 text-left border rounded-lg cursor-pointer hover:bg-blue-100 transition ${
                selectedDonation === donation.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 text-gray-800"
              }`}
            >
              <span className="text-sm font-medium">
                Donation ID: {donation.id}
              </span>
              {selectedDonation === donation.id && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Receipt Display */}
      <div className="col-span-3">
        {selectedDonation ? (
          <div className="p-6 bg-gray-100 rounded-lg shadow-inner">
            <h3 className="text-lg font-bold mb-4 text-gray-700">
              Selected Donation Details
            </h3>
            {/* Display dynamic donation details here */}
            <p className="text-gray-600">
              You selected Donation ID: {selectedDonation}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a donation ID to view the receipt.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationSearchSection;
