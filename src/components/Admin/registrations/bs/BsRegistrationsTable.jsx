import React from "react";
import DeleteActionButton from "../components/DeleteActionButton";
import TableStatusRow from "../components/TableStatusRow";
import { BS_TABLE_COLUMNS } from "./bsRegistrationConfig";

function BsRegistrationsTable({ registrations, loading, onDelete }) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-green-800 text-white uppercase text-sm leading-normal">
          <th className="py-3 px-6">Name</th>
          <th className="py-3 px-6">Phone</th>
          <th className="py-3 px-6">Year</th>
          <th className="py-3 px-6">Region</th>
          <th className="py-3 px-6">Group</th>
          <th className="py-3 px-6">Residence</th>
          <th className="py-3 px-6 text-center">Action</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {loading ? (
          <TableStatusRow colSpan={BS_TABLE_COLUMNS} message="Loading..." />
        ) : registrations.length === 0 ? (
          <TableStatusRow
            colSpan={BS_TABLE_COLUMNS}
            message="No records found matching filters."
          />
        ) : (
          registrations.map((reg) => (
            <tr
              key={reg._id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 font-medium text-gray-800">
                {reg.fullName}
              </td>
              <td className="py-3 px-6">{reg.phoneNumber}</td>
              <td className="py-3 px-6">{reg.yearOfStudy}</td>
              <td className="py-3 px-6">
                <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-bold">
                  {reg.region}
                </span>
              </td>
              <td className="py-3 px-6 font-bold">{reg.groupName}</td>
              <td className="py-3 px-6">{reg.catchmentArea}</td>
              <td className="py-3 px-6 text-center">
                <DeleteActionButton onClick={() => onDelete(reg._id)} />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default BsRegistrationsTable;
