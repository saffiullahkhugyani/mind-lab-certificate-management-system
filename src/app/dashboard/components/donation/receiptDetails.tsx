import React from "react";

const ReceiptDetails = () => {
  const receiptData = {
    sponsorName: "Ahmed Kajoor",
    phone: "+971 456 789",
    userId: "A1123",
    receiptId: "X113",
    vatId: "X113",
    date: "29-09-2024",
    items: [
      {
        type: "Donation amount",
        description: "Donation Fee",
        qty: 1,
        amount: 100.0,
      },
    ],
    subtotal: 110.0,
    totalAmount: 110.0,
    paymentMethod: "Card",
  };

  return (
    <div className=" mx-auto bg-white border rounded-lg shadow-lg p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Donation Details</h1>

      {/* Sponsor Info */}
      <div className="flex justify-between mb-6">
        <div>
          <p>
            <strong>Sponsor Name:</strong> {receiptData.sponsorName}
          </p>
          <p>
            <strong>Phone:</strong> {receiptData.phone}
          </p>
        </div>
        <div className="text-right">
          <p>
            <strong>USERID:</strong> {receiptData.userId}
          </p>
          <p>
            <strong>ReceiptID:</strong> {receiptData.receiptId}
          </p>
          <p>
            <strong>VATID:</strong> {receiptData.vatId}
          </p>
        </div>
      </div>

      {/* Date */}
      <p className="text-right mb-6">
        <strong>Date:</strong> {receiptData.date}
      </p>

      {/* Items Table */}
      <table className="w-full border-t border-b mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 text-left px-2">Type</th>
            <th className="py-2 text-left px-2">Description</th>
            <th className="py-2 text-center">Qty.</th>
            <th className="py-2 text-right px-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {receiptData.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-2">{item.type}</td>
              <td className="py-2 px-2">{item.description}</td>
              <td className="py-2 text-center">{item.qty}</td>
              <td className="py-2 text-right px-2">
                ${item.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer Details */}
      <p className="text-gray-600 mb-2">
        All donations are tax-deductible, currency is UAE.
      </p>
      <div className="text-right">
        <p>
          <strong>Subtotal:</strong> ${receiptData.subtotal.toFixed(2)}
        </p>
        <p className="text-xl font-bold mt-2">
          <strong>Total Amount:</strong> ${receiptData.totalAmount.toFixed(2)}
        </p>
        <p className="mt-2">
          <strong>Payment Method:</strong> {receiptData.paymentMethod}
        </p>
      </div>
    </div>
  );
};

export default ReceiptDetails;
