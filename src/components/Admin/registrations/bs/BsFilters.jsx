import React from "react";
import { BS_REGIONS } from "./bsRegistrationConfig";

function BsFilters({ filterRegion, filterGroup, onRegionChange, onGroupChange }) {
  return (
    <>
      <select
        value={filterRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        className="p-2 border rounded focus:ring-green-500 focus:ring-2 outline-none text-sm"
      >
        {BS_REGIONS.map((region) => (
          <option key={region.value} value={region.value}>
            {region.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search Group Name..."
        value={filterGroup}
        onChange={(e) => onGroupChange(e.target.value)}
        className="p-2 border rounded focus:ring-green-500 focus:ring-2 outline-none text-sm"
      />
    </>
  );
}

export default BsFilters;
