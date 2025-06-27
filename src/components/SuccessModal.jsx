import React from "react";

const SuccessModal = ({ transaction, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-green-700 mb-4 text-center">
          Payment Status: {transaction.status}
        </h3>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Phone:</strong> {transaction.phone}</p>
          <p><strong>Amount:</strong> KES {transaction.amount}</p>
          <p><strong>Purpose:</strong> {transaction.purpose}</p>
          <p><strong>MPesa Code:</strong> {transaction.mpesaReceiptNumber || "Pending"}</p>
          <p><strong>Description:</strong> {transaction.resultDesc}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
