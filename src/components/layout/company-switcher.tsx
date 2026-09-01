"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { toast } from "sonner";
import {
  Building2,
  ChevronDown,
  Check,
  Plus,
  Search,
  ExternalLink,
  RefreshCw,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { companiesApi } from "@/lib/api/companies/companies";
import { CreateCompanyDto, MyCompanyEntry } from "@/lib/api/types";
import { CreateCompanyModal } from "@/screens/companies/components/create-company-modal";

interface CompanySwitcherProps {
  compact?: boolean;
  className?: string;
}

export function CompanySwitcher({ compact = false, className }: CompanySwitcherProps) {
  const {
    companies,
    activeCompanyId,
    activeCompanyName,
    setActiveCompany,
    fetchMyCompanies,
  } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("touchstart", handleMouseDown);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("touchstart", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Bootstrap companies on first mount
  useEffect(() => {
    if (companies.length === 0) {
      fetchMyCompanies().catch(() => {});
    }
  }, [companies.length, fetchMyCompanies]);

  const activeEntry = companies.find((c) => c.companyId === activeCompanyId);
  const displayName = activeCompanyName || activeEntry?.companyName || "Select Company";
  const displayCurrency = activeEntry?.baseCurrency;

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    try {
      await fetchMyCompanies();
      toast.success("Companies refreshed");
    } catch {
      toast.error("Failed to refresh companies");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelect = (comp: MyCompanyEntry) => {
    setActiveCompany(comp.companyId, comp.companyName);
    setIsOpen(false);
    toast.info(`Active company: ${comp.companyName}`);
  };

  const handleCreateCompany = async (dto: CreateCompanyDto) => {
    const actingId = activeCompanyId || companies[0]?.companyId || "";
    setIsSubmitting(true);
    try {
      const created = await companiesApi.createCompany(actingId, dto);
      toast.success(`Company "${dto.name}" created`);
      setIsCreateModalOpen(false);
      // Refresh the companies list from /me/companies so the new one appears
      const updated = await fetchMyCompanies();
      // Auto-switch to the freshly created company
      const found = updated.find((c) => c.companyId === created.id);
      setActiveCompany(created.id, found?.companyName ?? dto.name);
      toast.info(`Switched to "${dto.name}"`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create company");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = companies.filter((c) =>
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className={clsx("relative", className)} ref={dropdownRef}>
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={clsx(
            "flex items-center gap-2 rounded-xl border border-stroke bg-white px-3 py-2 text-left shadow-xs transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-dark-3 cursor-pointer outline-none focus:ring-2 focus:ring-primary/20",
            compact ? "w-full justify-between" : "max-w-[260px]"
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex items-center gap-1">
              <span className="truncate text-xs font-bold text-dark dark:text-white">
                {displayName}
              </span>
              {displayCurrency && (
                <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {displayCurrency}
                </span>
              )}
            </div>
            <span className="text-[10px] text-dark-5 dark:text-dark-6 truncate">
              {activeCompanyId ? "Active context" : "No company selected"}
            </span>
          </div>

          <ChevronDown
            className={clsx(
              "h-3.5 w-3.5 shrink-0 text-dark-5 transition-transform duration-200",
              isOpen && "rotate-180 text-primary"
            )}
          />
        </button>

        {/* Anchored Dropdown Popover */}
        {isOpen && (
          <div
            className={clsx(
              "absolute z-[100] mt-2 max-w-[calc(100vw-2rem)] rounded-2xl border border-stroke bg-white shadow-2 dark:border-dark-3 dark:bg-gray-dark animate-in fade-in zoom-in-95 duration-100",
              compact
                ? "left-0 w-full min-w-[240px]"
                : "left-0 sm:left-auto sm:right-0 md:left-0 md:right-auto w-80"
            )}
          >
            {/* Dropdown header */}
            <div className="flex items-center justify-between border-b border-stroke px-3.5 py-2.5 dark:border-dark-3">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-dark dark:text-white">Companies</span>
                <span className="rounded-full bg-gray-2 px-1.5 py-0.5 text-[10px] font-semibold text-dark-5 dark:bg-dark-3 dark:text-dark-6">
                  {companies.length}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                title="Sync companies"
                className="rounded-lg p-1 text-dark-5 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white transition cursor-pointer"
              >
                <RefreshCw className={clsx("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")} />
              </button>
            </div>

            {/* Search – only shown when > 3 companies */}
            {companies.length > 3 && (
              <div className="relative border-b border-stroke px-3 py-2 dark:border-dark-3">
                <Search className="absolute left-6 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
                <input
                  type="text"
                  placeholder="Filter companies…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full rounded-xl border border-stroke bg-gray-2 py-1.5 pl-8 pr-3 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
              </div>
            )}

            {/* Company list */}
            <div className="max-h-56 overflow-y-auto no-scrollbar p-2 space-y-0.5" role="listbox">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs text-dark-5 dark:text-dark-6">
                  <Building2 className="mx-auto mb-1.5 h-6 w-6 opacity-30" />
                  No companies found.
                </div>
              ) : (
                filtered.map((comp) => {
                  const isActive = comp.companyId === activeCompanyId;
                  const ownerRole = comp.roles?.find((r) => r.isOwnerRole);
                  const roleName = ownerRole?.name ?? comp.roles?.[0]?.name;

                  return (
                    <button
                      key={comp.companyId}
                      role="option"
                      aria-selected={isActive}
                      type="button"
                      onClick={() => handleSelect(comp)}
                      className={clsx(
                        "group w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition cursor-pointer select-none",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                          : "text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-dark-3"
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div
                          className={clsx(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-[11px] transition",
                            isActive
                              ? "bg-primary text-white"
                              : "bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-dark-6 group-hover:bg-primary/10 group-hover:text-primary"
                          )}
                        >
                          {comp.companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 truncate">
                            <span className="truncate">{comp.companyName}</span>
                            {comp.baseCurrency && (
                              <span className="shrink-0 font-mono text-[10px] text-dark-5 dark:text-dark-6">
                                ({comp.baseCurrency})
                              </span>
                            )}
                          </div>
                          {roleName && (
                            <div className="flex items-center gap-0.5 text-[10px] text-dark-5 dark:text-dark-6">
                              {ownerRole && <Shield className="h-2.5 w-2.5 text-amber-500" />}
                              <span className={ownerRole ? "text-amber-600 dark:text-amber-400 font-semibold" : ""}>
                                {roleName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer actions */}
            <div className="border-t border-stroke p-2 space-y-0.5 dark:border-dark-3">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsCreateModalOpen(true);
                }}
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Create New Company
              </button>

              <Link
                href="/dashboard/organization/companies"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-dark-5 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white transition"
              >
                <span>Manage All Companies</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <CreateCompanyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCompany}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
