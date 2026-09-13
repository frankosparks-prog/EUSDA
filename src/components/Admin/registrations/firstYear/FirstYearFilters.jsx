import React from "react";
import { GENDER_OPTIONS } from "./firstYearRegistrationConfig";

function FirstYearFilters({
  filterGender,
  filterDate,
  onGenderChange,
  onDateChange,
  onClearDate,
}) {
  return (
    <>
      <select
        value={filterGender}
        onChange={(e) => onGenderChange(e.target.value)}
        className="p-2 border border-gray-200 rounded-lg focus:ring-green-500 focus:ring-2 outline-none text-sm font-medium bg-gray-50"
      >
        {GENDER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={filterDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="p-2 border border-gray-200 rounded-lg focus:ring-green-500 focus:ring-2 outline-none text-sm font-medium bg-gray-50"
        title="Filter by registration date"
      />

      {filterDate && (
        <button
          onClick={onClearDate}
          className="text-xs text-gray-500 hover:text-green-700 font-semibold transition"
        >
          Clear date
        </button>
      )}
    </>
  );
}

export default FirstYearFilters;
