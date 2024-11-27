import React from "react";
import ReceiptDetails from "./receiptDetails";

const DonationReceipt = () => {
  const donationData = [
    { id: "2024-001", date: "2024-01-15" },
    { id: "2024-002", date: "2024-02-20" },
    { id: "2024-003", date: "2024-03-10" },
    { id: "2024-004", date: "2024-04-22" },
    { id: "2024-005", date: "2024-05-30" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* Sidebar */}
      <div className="col-span-1 border-r pr-4">
        <h2 className="text-lg font-semibold mb-4">Donation Receipt</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Invoice..."
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Date Filter */}
        <div className="flex mb-4 gap-2">
          <input
            type="date"
            placeholder="Start Date"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            placeholder="End Date"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Donation IDs */}
        <div className="space-y-2">
          {donationData.map((donation) => (
            <label key={donation.id} className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>{`Donation ID: ${donation.id}`}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Donation Details */}
      <div className="col-span-2">
        <ReceiptDetails />
      </div>
    </div>
  );
};

export default DonationReceipt;
