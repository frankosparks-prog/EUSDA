import React, { useEffect } from "react";
import { Ticket, X } from "lucide-react";
import TicketForm from "./TicketForm";

export default function TicketModal({ isOpen, onClose, event }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100 bg-gray-50/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700">
              <Ticket size={18} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight">
                Get Your Ticket
              </h2>
              <p className="text-xs text-gray-500">
                Fill in your details to reserve your spot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-gray-300 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-left">
          <TicketForm event={event} isModal={true} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
