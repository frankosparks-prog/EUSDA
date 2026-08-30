import React from "react";
import { Download, Filter } from "lucide-react";

function FilterToolbar({ children, onExportPdf, variant = "default" }) {
  const isModern = variant === "modern";

  return (
    <div
      className={`flex flex-wrap gap-3 items-center bg-white p-3 shadow-sm ${
        isModern
          ? "rounded-xl border border-gray-100"
          : "rounded-lg"
      }`}
    >
      <div
        className={`flex items-center gap-2 ${
          isModern ? "text-gray-500" : "text-gray-600"
        }`}
      >
        <Filter size={18} strokeWidth={isModern ? 2.25 : 2} />
        <span
          className={
            isModern
              ? "font-semibold text-sm tracking-wide"
              : "font-bold"
          }
        >
          Filter:
        </span>
      </div>

      {children}

      <button
        onClick={onExportPdf}
        className={`flex items-center gap-2 bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition shadow-sm ${
          isModern
            ? "rounded-lg font-semibold tracking-wide"
            : "rounded font-bold shadow"
        }`}
      >
        <Download size={18} strokeWidth={isModern ? 2.25 : 2} /> PDF
      </button>
    </div>
  );
}

export default FilterToolbar;
