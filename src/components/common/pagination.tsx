"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  embedded?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  embedded = false,
  className = "",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - delta - 1 && i > 1) ||
        (i === currentPage + delta + 1 && i < totalPages)
      ) {
        pages.push("...");
      }
    }

    return pages.filter((item, index, array) => {
      return item !== "..." || array[index - 1] !== "...";
    });
  };

  const pageNumbers = getPageNumbers();

  const containerClasses = embedded
    ? `flex flex-col gap-4 border-t border-stroke bg-white px-5 py-4 dark:border-dark-3 dark:bg-gray-dark sm:flex-row sm:items-center sm:justify-between ${className}`
    : `flex flex-col gap-4 rounded-2xl border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:flex-row sm:items-center sm:justify-between ${className}`;

  return (
    <div className={containerClasses}>
      {/* Summary and Page Size Selector */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-dark-5 dark:text-dark-6">
        <span>
          Showing <strong className="font-semibold text-dark dark:text-white">{startItem}</strong> to{" "}
          <strong className="font-semibold text-dark dark:text-white">{endItem}</strong> of{" "}
          <strong className="font-semibold text-dark dark:text-white">{totalItems}</strong> entries
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="appearance-none rounded-xl border border-stroke bg-gray-2 py-1 pl-3 pr-7 text-xs font-semibold text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition cursor-pointer"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
            </div>
          </div>
        )}
      </div>

      {/* Pagination Nav Buttons */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="First Page"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-stroke bg-white text-dark hover:bg-gray-2 disabled:opacity-40 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 transition shadow-xs"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Prev Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous Page"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-stroke bg-white text-dark hover:bg-gray-2 disabled:opacity-40 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 transition shadow-xs"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pg, idx) => {
            if (pg === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs font-semibold text-dark-5 dark:text-dark-6"
                >
                  ...
                </span>
              );
            }

            const pageNum = pg as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-xl px-2.5 text-xs font-bold transition shadow-xs ${
                  isActive
                    ? "bg-primary text-white"
                    : "border border-stroke bg-white text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Next Page"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-stroke bg-white text-dark hover:bg-gray-2 disabled:opacity-40 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 transition shadow-xs"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          title="Last Page"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-stroke bg-white text-dark hover:bg-gray-2 disabled:opacity-40 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 transition shadow-xs"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
