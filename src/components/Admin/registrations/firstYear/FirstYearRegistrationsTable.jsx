import React from "react";
import { format } from "date-fns";
import DeleteActionButton from "../components/DeleteActionButton";
import TableStatusRow from "../components/TableStatusRow";
import { FIRST_YEAR_TABLE_COLUMNS } from "./firstYearRegistrationConfig";

function FirstYearRegistrationsTable({ registrations, loading, onDelete }) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-green-800 text-white uppercase text-[11px] font-semibold tracking-wider">
          <th className="py-4 px-6">Name</th>
          <th className="py-4 px-6">Phone</th>
          <th className="py-4 px-6">Gender</th>
          <th className="py-4 px-6">Date Registered</th>
          <th className="py-4 px-6">Email</th>
          <th className="py-4 px-6 text-center">Action</th>
        </tr>
      </thead>
      <tbody className="text-slate-600 text-sm">
        {loading ? (
          <TableStatusRow
            colSpan={FIRST_YEAR_TABLE_COLUMNS}
            message="Loading..."
            className="font-medium text-slate-400 py-8"
          />
        ) : registrations.length === 0 ? (
          <TableStatusRow
            colSpan={FIRST_YEAR_TABLE_COLUMNS}
            message="No records found matching filters."
            className="font-medium text-slate-400 py-8"
          />
        ) : (
          registrations.map((reg) => (
            <tr
              key={reg._id}
              className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
            >
              <td className="py-4 px-6 font-semibold text-slate-900">
                {reg.fullName}
              </td>
              <td className="py-4 px-6 font-medium text-slate-600">
                {reg.phoneNumber}
              </td>
              <td className="py-4 px-6">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                    reg.gender === "Male"
                      ? "bg-blue-50/60 text-blue-700 border-blue-100/80"
                      : "bg-pink-50/60 text-pink-700 border-pink-100/80"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      reg.gender === "Male" ? "bg-blue-500" : "bg-pink-500"
                    }`}
                  ></span>
                  {reg.gender}
                </span>
              </td>
              <td className="py-4 px-6 font-medium text-slate-500">
                {format(new Date(reg.createdAt), "do MMM yyyy")}
              </td>
              <td className="py-4 px-6 font-medium">
                {reg.email ? (
                  <span className="text-slate-600">{reg.email}</span>
                ) : (
                  <span className="text-slate-300 italic font-normal">—</span>
                )}
              </td>
              <td className="py-4 px-6 text-center">
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
