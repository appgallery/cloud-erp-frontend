"use client";

import React from "react";
import {
  Users,
  Briefcase,
  Trophy,
  DollarSign,
  TrendingUp,
  TrendingDown,
  LucideIcon,
} from "lucide-react";

interface StatItem {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
  icon: LucideIcon;
  color: string;
}

export function CrmStats() {
  const stats: StatItem[] = [
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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-dark-5 dark:text-dark-6">
                {stat.title}
              </span>
              <div className={`rounded-xl p-2.5 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-dark dark:text-white">
                {stat.value}
              </h3>
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                  stat.isUp ? "text-green" : "text-red"
                }`}
              >
                {stat.isUp ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {stat.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
