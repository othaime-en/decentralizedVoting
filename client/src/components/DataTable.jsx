// DataTable.js
import React, { useState } from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";

import { getStatusColor } from "../utils";
import PDFDownloadButton from "./PDFDownloadButton";

const DataTable = ({ columns, data }) => {
  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Define enhanced columns with color-coded statuses
  const enhancedColumns = React.useMemo(() => {
    return columns.map((col) => {
      if (col.accessor === "instanceStatus") {
        return {
          ...col,
          Cell: ({ value }) => {
            const color = getStatusColor(value);
            return <div style={{ color }}>{value}</div>;
          },
        };
      }
      return col;
    });
  }, [columns]);

  // Setup for useTable including sorting, filtering, and pagination
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Use 'page', not 'rows'. 'rows' would be the entire dataset.
    prepareRow,
    setFilter,
    setAllFilters,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: enhancedColumns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // Set the initial page index and size
    },
    useFilters,
    useSortBy,
    usePagination
  );

  // Function to reset all filters
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
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-4 py-3 text-sm text-gray-400"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination control */}
      <div className="flex justify-between items-center py-3 bg-[#1c1c24] text-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="text-xs text-white bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 px-2 py-1 rounded-md"
          >
            {"<<"}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="text-xs text-white bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 px-2 py-1 rounded-md"
          >
            {"<"}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="text-xs text-white bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 px-2 py-1 rounded-md"
          >
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="text-xs text-white bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 px-2 py-1 rounded-md"
          >
            {">>"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="text-xs text-gray-300 bg-gray-800 border border-gray-600 rounded-md p-1"
          >
            {[5, 10, 20, 30].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
          <PDFDownloadButton
            data={data}
            columns={columns}
            title="Your Table Title"
          />
        </div>
      </div>
    </>
  );
};

export default DataTable;
