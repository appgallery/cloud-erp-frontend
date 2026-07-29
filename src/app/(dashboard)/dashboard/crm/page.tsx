import React from "react";
import type { Metadata } from "next";
import {
  Users,
  Briefcase,
  Trophy,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Filter,
  Download,
} from "lucide-react";

export const metadata: Metadata = {
  title: "CRM Dashboard | Cloud ERP",
  description: "Customer Relationship Management Dashboard",
};

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Leads",
      value: "1,248",
      change: "+14.5%",
      isUp: true,
      icon: Users,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Active Deals",
      value: "342",
      change: "+8.2%",
      isUp: true,
      icon: Briefcase,
      color: "bg-purple-50 text-primary dark:bg-purple-950/40 dark:text-purple-400",
    },
    {
      title: "Win Rate",
      value: "24.8%",
      change: "-2.1%",
      isUp: false,
      icon: Trophy,
      color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    },
    {
      title: "Forecasted Revenue",
      value: "$845,000",
      change: "+18.4%",
      isUp: true,
      icon: DollarSign,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
    },
  ];

  const recentDeals = [
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

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            CRM Overview
          </h2>
          <p className="text-sm font-medium text-dark-5 dark:text-dark-6">
            Track leads, deals, and sales pipeline performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-stroke bg-white px-4 py-2.5 text-sm font-medium text-dark shadow-1 hover:bg-gray-2 dark:border-dark-3 dark:bg-gray-dark dark:text-white dark:hover:bg-dark-3 cursor-pointer">
            <Filter className="h-4 w-4 text-dark-5" />
            Filter Data
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-1 hover:bg-opacity-90 cursor-pointer">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>

                <div
                  className={`flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 ${
                    stat.isUp
                      ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                      : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                  }`}
                >
                  {stat.isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {stat.change}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-2xl font-bold text-dark dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-xs font-medium text-dark-5 dark:text-dark-6 mt-1">
                  {stat.title} vs last month
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analytics + Quick Actions Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sales Pipeline Widget */}
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-dark dark:text-white">
                Sales Pipeline
              </h3>
              <p className="text-xs font-medium text-dark-5 dark:text-dark-6">
                Monthly leads generation vs deals closed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-dark-5 dark:text-dark-6">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Leads
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-dark-5 dark:text-dark-6 ml-3">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" /> Deals Closed
              </span>
            </div>
          </div>

          {/* Graphical Bars Visualizer */}
          <div className="h-64 flex items-end gap-3 pt-8 pb-2 px-2 border-b border-stroke dark:border-dark-3">
            {[
              { month: "Jan", leads: "80%", deals: "30%" },
              { month: "Feb", leads: "95%", deals: "45%" },
              { month: "Mar", leads: "60%", deals: "25%" },
              { month: "Apr", leads: "85%", deals: "50%" },
              { month: "May", leads: "70%", deals: "40%" },
              { month: "Jun", leads: "100%", deals: "65%" },
              { month: "Jul", leads: "90%", deals: "75%" },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  <div
                    style={{ height: bar.leads }}
                    className="w-1/2 bg-primary rounded-t-md transition-all duration-300 group-hover:bg-opacity-80"
                  />
                  <div
                    style={{ height: bar.deals }}
                    className="w-1/2 bg-green-400 rounded-t-md transition-all duration-300 group-hover:bg-opacity-80"
                  />
                </div>
                <span className="text-xs font-medium text-dark-5 dark:text-dark-6">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deals Summary Card */}
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
            Deals by Stage
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-2 dark:bg-dark-2">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-dark dark:text-white">Overall Pipeline Health</span>
                <span className="text-primary font-bold">Good</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[85%]" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium border-b border-stroke dark:border-dark-3 pb-2.5">
                <span className="text-dark-5 dark:text-dark-6">Prospecting</span>
                <span className="font-bold text-dark dark:text-white">124 Deals</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium border-b border-stroke dark:border-dark-3 pb-2.5">
                <span className="text-dark-5 dark:text-dark-6">Qualification</span>
                <span className="font-bold text-dark dark:text-white">85 Deals</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium border-b border-stroke dark:border-dark-3 pb-2.5">
                <span className="text-dark-5 dark:text-dark-6">Proposal</span>
                <span className="font-bold text-blue-500">42 Deals</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium border-b border-stroke dark:border-dark-3 pb-2.5">
                <span className="text-dark-5 dark:text-dark-6">Negotiation</span>
                <span className="font-bold text-amber-500">18 Deals</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-dark-5 dark:text-dark-6">Closed Won (MTD)</span>
                <span className="font-bold text-green-500">22 Deals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Deals Table */}
      <div className="rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-dark dark:text-white">
              Recent Deals
            </h3>
            <p className="text-xs font-medium text-dark-5 dark:text-dark-6">
              Latest opportunities added to the pipeline
            </p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer">
            View All Deals
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3 text-xs font-semibold text-dark-5 dark:text-dark-6 uppercase tracking-wider">
                <th className="py-3.5 px-4">Deal ID</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Probability</th>
                <th className="py-3.5 px-4">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-dark-3 text-sm font-medium">
              {recentDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-2/50 dark:hover:bg-dark-2/50 transition">
                  <td className="py-3.5 px-4 font-bold text-dark dark:text-white">{deal.id}</td>
                  <td className="py-3.5 px-4 text-dark-4 dark:text-dark-6">{deal.client}</td>
                  <td className="py-3.5 px-4 text-xs font-medium text-dark-5 dark:text-dark-6">{deal.contact}</td>
                  <td className="py-3.5 px-4 font-bold text-dark dark:text-white">{deal.amount}</td>
                  <td className="py-3.5 px-4 text-dark-5 dark:text-dark-6 text-xs">{deal.probability}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        deal.stage === "Closed Won"
                          ? "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                          : deal.stage === "Proposal" || deal.stage === "Negotiation"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                          : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                      }`}
                    >
                      {deal.stage}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}