import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function AdminPagination({
  rangeStart,
  rangeEnd,
  totalFiltered,
  safePage,
  totalPages,
  onPrev,
  onNext,
  borderClassName = "border-gray-200",
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t ${borderClassName}`}
    >
      <p className="text-sm text-gray-500 font-medium">
        Showing {rangeStart}–{rangeEnd} of {totalFiltered}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={safePage === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-green-50 hover:border-green-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <span className="text-sm font-semibold text-gray-600 px-2">
          Page {safePage + 1} of {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={safePage >= totalPages - 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-green-50 hover:border-green-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default AdminPagination;
