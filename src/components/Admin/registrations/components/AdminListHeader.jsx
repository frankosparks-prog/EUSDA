import React from "react";
import { Users } from "lucide-react";

function AdminListHeader({
  title,
  totalAll,
  totalFiltered,
  variant = "default",
}) {
  const isModern = variant === "modern";

  return (
    <div>
      <h1
        className={`text-3xl font-bold text-green-900 flex items-center gap-2 ${
          isModern ? "tracking-tight" : ""
        }`}
      >
        <Users strokeWidth={isModern ? 2.25 : 2} /> {title}
      </h1>
      <p
        className={`${
          isModern ? "text-gray-500 font-medium mt-1" : "text-gray-600"
        }`}
      >
        {isModern ? (
          <>
            Total Registered:{" "}
            <span className="text-green-800 font-semibold">{totalAll}</span>
          </>
        ) : (
          <>Total Registered: {totalAll}</>
        )}
        {totalFiltered !== totalAll && (
          <span className="text-gray-400">
            {" "}
            · {totalFiltered} matching filters
          </span>
        )}
      </p>
    </div>
  );
}

export default AdminListHeader;
