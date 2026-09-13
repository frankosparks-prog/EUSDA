import React from "react";

function TableStatusRow({ colSpan, message, className = "" }) {
  return (
    <tr>
      <td colSpan={colSpan} className={`text-center py-10 ${className}`}>
        {message}
      </td>
    </tr>
  );
}

export default TableStatusRow;
