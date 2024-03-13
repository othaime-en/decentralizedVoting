// DataTable.js
import React, { useState } from "react";
import { useTable, useSortBy, useFilters } from "react-table";

import { getStatusColor } from "../utils";

const DataTable = ({ columns, data }) => {
  // State to keep track of filter inputs
  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const enhancedColumns = React.useMemo(() => {
    return columns.map((col) => {
      if (col.accessor === "instanceStatus") {
        return {
          ...col,
          Cell: ({ value }) => {
            const color = getStatusColor(value);
            return <span style={{ color }}>{value}</span>;
          },
        };
      }
      return col;
    });
  }, [columns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
    setAllFilters,
  } = useTable({ columns: enhancedColumns, data }, useFilters, useSortBy);

  // Resets all filters
  const resetFilters = () => {
    setTitleFilter("");
    setStatusFilter("");
    setAllFilters([]);
  };

  return (
    <>
      <div className="flex justify-end p-2 space-x-2">
        <input
          value={titleFilter}
          onChange={(e) => {
            setTitleFilter(e.target.value);
            setFilter("title", e.target.value);
          }}
          placeholder={`Search Title...`}
          className="text-sm bg-gray-800 border border-gray-600 rounded-md p-2 text-white"
        />
        <input
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setFilter("instanceStatus", e.target.value);
          }}
          placeholder={`Search Status...`}
          className="text-sm bg-gray-800 border border-gray-600 rounded-md p-2 text-white"
        />
        <button
          onClick={resetFilters}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition duration-200"
        >
          Reset Filters
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table {...getTableProps()} className="w-full whitespace-no-wrap">
          <thead className="text-xs font-semibold tracking-wide text-left text-gray-400 uppercase border-b bg-gray-700">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-4 py-3 cursor-pointer"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="bg-gray-800 divide-y divide-gray-700"
          >
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="px-4 py-3 text-sm text-gray-400"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DataTable;
