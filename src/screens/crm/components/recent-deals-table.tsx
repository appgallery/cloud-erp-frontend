"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

interface Deal {
  id: string;
  client: string;
  contact: string;
  date: string;
  amount: string;
  stage: string;
  probability: string;
}

export function RecentDealsTable() {
  const deals: Deal[] = [
    {
      id: "DL-2026-001",
      client: "Acme Corp Enterprise",
      contact: "Alice Johnson",
      date: "Jul 28, 2026",
      amount: "$124,500",
      stage: "Closed Won",
      probability: "100%",
    },
    {
      id: "DL-2026-002",
      client: "Global Tech Solutions",
      contact: "Robert Smith",
      date: "Jul 28, 2026",
      amount: "$48,000",
      stage: "Negotiation",
      probability: "80%",
    },
    {
      id: "DL-2026-003",
      client: "Apex Raw Materials Ltd",
      contact: "Charlie Davis",
      date: "Jul 27, 2026",
      amount: "$89,200",
      stage: "Proposal",
      probability: "50%",
    },
    {
      id: "DL-2026-004",
      client: "Starlight Retailers",
      contact: "Diana Prince",
      date: "Jul 26, 2026",
      amount: "$31,500",
      stage: "Closed Won",
      probability: "100%",
    },
    {
      id: "DL-2026-005",
      client: "Nexus Systems",
      contact: "Evan Wright",
      date: "Jul 25, 2026",
      amount: "$156,000",
      stage: "Closed Lost",
      probability: "0%",
    },
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Closed Won":
        return "bg-green/10 text-green dark:bg-green/20";
      case "Closed Lost":
        return "bg-red/10 text-red dark:bg-red/20";
      case "Negotiation":
        return "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20";
      default:
        return "bg-primary/10 text-primary dark:bg-primary/20";
    }
  };

  return (
    <div className="rounded-2xl border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-dark dark:text-white">
            Recent Deals & Pipeline
          </h3>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            Track key opportunities and win probability.
          </p>
        </div>
        <button className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
          View All <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Responsive Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-2 text-dark-5 dark:bg-dark-2 dark:text-dark-6 uppercase font-bold text-[10px]">
            <tr>
              <th className="px-4 py-3">Deal Ref</th>
              <th className="px-4 py-3">Client & Contact</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Probability</th>
              <th className="px-4 py-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-dark-3">
            {deals.map((deal) => (
              <tr key={deal.id} className="hover:bg-gray-2/50 dark:hover:bg-dark-2/50 transition">
                <td className="px-4 py-3.5 font-bold text-dark dark:text-white">
                  {deal.id}
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-bold text-dark dark:text-white block">
                    {deal.client}
                  </span>
                  <span className="text-[11px] text-dark-5">{deal.contact}</span>
                </td>
                <td className="px-4 py-3.5 font-bold text-dark dark:text-white">
                  {deal.amount}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getStageColor(
                      deal.stage
                    )}`}
                  >
                    {deal.stage}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-gray-2 dark:bg-dark-2 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: deal.probability }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-dark-5">
                      {deal.probability}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right text-dark-5">
                  {deal.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
