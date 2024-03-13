// filters.js
import React from "react";

export const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || title); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
      className="mt-2 text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg p-1"
    />
  );
};
