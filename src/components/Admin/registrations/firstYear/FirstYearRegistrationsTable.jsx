import React from "react";
import { format } from "date-fns";
import DeleteActionButton from "../components/DeleteActionButton";
import TableStatusRow from "../components/TableStatusRow";
import { FIRST_YEAR_TABLE_COLUMNS } from "./firstYearRegistrationConfig";

function FirstYearRegistrationsTable({ registrations, loading, onDelete }) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-green-800 text-white uppercase text-xs leading-normal tracking-wider">
          <th className="py-3.5 px-6 font-semibold">Name</th>
          <th className="py-3.5 px-6 font-semibold">Phone</th>
          <th className="py-3.5 px-6 font-semibold">Gender</th>
          <th className="py-3.5 px-6 font-semibold">Date Registered</th>
          <th className="py-3.5 px-6 font-semibold">Email</th>
          <th className="py-3.5 px-6 text-center font-semibold">Action</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm">
        {loading ? (
          <TableStatusRow
            colSpan={FIRST_YEAR_TABLE_COLUMNS}
            message="Loading..."
            className="font-medium"
          />
        ) : registrations.length === 0 ? (
          <TableStatusRow
            colSpan={FIRST_YEAR_TABLE_COLUMNS}
            message="No records found matching filters."
            className="font-medium"
          />
        ) : (
          registrations.map((reg) => (
            <tr
              key={reg._id}
              className="border-b border-gray-100 hover:bg-green-50/40 transition-colors"
            >
              <td className="py-3.5 px-6 font-semibold text-gray-800">
                {reg.fullName}
              </td>
              <td className="py-3.5 px-6 font-medium">{reg.phoneNumber}</td>
              <td className="py-3.5 px-6">
                <span
                  className={`py-1 px-3 rounded-full text-xs font-semibold tracking-wide ${
                    reg.gender === "Male"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-pink-100 text-pink-800"
                  }`}
                >
                  {reg.gender}
                </span>
              </td>
              <td className="py-3.5 px-6 font-medium text-gray-500">
                {format(new Date(reg.createdAt), "do MMM yyyy")}
              </td>
              <td className="py-3.5 px-6">
                {reg.email ? (
                  <span className="font-medium text-gray-600">{reg.email}</span>
                ) : (
                  <span className="text-gray-300 italic font-medium">—</span>
                )}
              </td>
              <td className="py-3.5 px-6 text-center">
                <DeleteActionButton
                  onClick={() => onDelete(reg._id)}
                  strokeWidth={2.25}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default FirstYearRegistrationsTable;
