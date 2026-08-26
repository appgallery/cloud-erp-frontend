"use client";

import React from "react";
import { useLoadingStore } from "@/store/use-loading-store";
import { ShieldCheck, Sparkles } from "lucide-react";

export function GlobalLoadingBar() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-dark/40 dark:bg-black/75 backdrop-blur-xs transition-opacity duration-300">
      {/* Modern Centered Glassmorphism Card */}
      <div className="relative flex flex-col items-center justify-center rounded-3xl bg-white/95 p-7 shadow-2xl backdrop-blur-md dark:bg-gray-900/95 border border-stroke dark:border-dark-3 max-w-xs w-full mx-4 animate-in zoom-in-95 fade-in duration-200">
        
        {/* Glowing Dual Spinning Ring with Brand Icon */}
        <div className="relative flex items-center justify-center mb-3">
          {/* Outer Rotating Gradient Accent Ring */}
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary border-r-primary animate-spin" />
          
          {/* Inner Pulsing Brand Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="h-7 w-7 text-primary animate-pulse" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-dark dark:text-white tracking-tight">
            <span>Updating Cloud ERP</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          </div>
          <p className="text-xs text-dark-5 dark:text-dark-6 font-medium">
            Processing secure request...
          </p>
        </div>

        {/* Bottom Shimmer Progress Bar */}
        <div className="w-full mt-3 h-1.5 bg-gray-2 dark:bg-dark-2 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-blue-500 to-indigo-600 animate-pulse w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
