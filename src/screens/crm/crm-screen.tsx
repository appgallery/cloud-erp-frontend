"use client";

import React from "react";
import { CrmStats } from "./components/crm-stats";
import { RecentDealsTable } from "./components/recent-deals-table";
import { Filter, Download, Briefcase } from "lucide-react";

export function CrmScreen() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-1 dark:bg-gray-dark border border-stroke dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2.5">
            <Briefcase className="h-7 w-7 text-primary" />
            CRM & Sales Overview
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Monitor customer relationships, deal stages, and sales team performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-stroke bg-white px-4 py-2.5 text-xs font-semibold text-dark shadow-xs hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90">
            <Download className="h-4 w-4" />
            Export Summary
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <CrmStats />

      {/* Deals Roster Table */}
      <RecentDealsTable />
    </div>
  );
}
