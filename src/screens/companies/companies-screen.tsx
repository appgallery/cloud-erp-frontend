"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { companiesApi } from "@/lib/api/companies/companies";
import { CompanyDto, CreateCompanyDto, UpdateCompanyDto } from "@/lib/api/types";
import { Pagination } from "@/components/common/pagination";
import { CreateCompanyModal } from "./components/create-company-modal";
import { EditCompanyModal } from "./components/edit-company-modal";
import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Globe,
  DollarSign,
  CheckCircle2,
  XCircle,
  TrendingUp,
  MapPin,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export function CompaniesScreen() {
  const { activeCompanyId, fetchMyCompanies } = useAuthStore();

  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Filter & Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "code" | "createdAt">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Companies Data
  const loadCompanies = useCallback(async () => {
    if (!activeCompanyId) return;
    setLoading(true);
    try {
      const res = await companiesApi.listCompanies(activeCompanyId, {
        page,
        pageSize,
        search: searchTerm || undefined,
        sortBy,
        sortDir,
        isActive: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
      });
      setCompanies(res.items || []);
      setTotalItems(res.total || 0);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, page, pageSize, searchTerm, sortBy, sortDir, statusFilter]);

  useEffect(() => {
    if (!activeCompanyId) {
      fetchMyCompanies();
    } else {
      loadCompanies();
    }
  }, [activeCompanyId, fetchMyCompanies, loadCompanies]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleSort = (field: "name" | "code" | "createdAt") => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const renderSortIcon = (field: "name" | "code" | "createdAt") => {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-3 w-3 text-dark-5 opacity-40 group-hover:opacity-100 transition" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary" />
    );
  };

  const handleCreateCompany = async (dto: CreateCompanyDto) => {
    if (!activeCompanyId) {
      toast.error("Active company context required to perform this action");
      return;
    }
    setIsSubmitting(true);
    try {
      await companiesApi.createCompany(activeCompanyId, dto);
      toast.success(`Company "${dto.name}" created successfully`);
      setIsCreateModalOpen(false);
      await fetchMyCompanies();
      await loadCompanies();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create company");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCompany = async (companyId: string, dto: UpdateCompanyDto) => {
    setIsSubmitting(true);
    try {
      await companiesApi.updateCompany(companyId, dto);
      toast.success("Company updated successfully");
      setIsEditModalOpen(false);
      setSelectedCompany(null);
      await fetchMyCompanies();
      await loadCompanies();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update company");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCount = companies.filter((c) => c.isActive).length;

  const stats = [
    {
      title: "Total Companies",
      value: totalItems.toString(),
      change: "Active Org Roster",
      icon: Building2,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Operational Status",
      value: `${activeCount} / ${companies.length}`,
      change: "Active Entities",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    },
    {
      title: "Base Currencies",
      value: "Multi-Currency",
      change: "ISO 4217 Standard",
      icon: DollarSign,
      color: "bg-purple-50 text-primary dark:bg-purple-950/40 dark:text-purple-400",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-1 dark:bg-gray-dark border border-stroke dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Building2 className="h-4 w-4" />
            <span>Organization Companies Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2.5 tracking-tight">
            Company Entities Management
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Configure companies, financial base currencies, tax IDs, and global timezone settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCompanies}
            title="Refresh Data"
            className="flex items-center gap-2 rounded-xl border border-stroke bg-white px-3.5 py-2.5 text-xs font-semibold text-dark shadow-xs hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-primary" : ""}`} />
            Sync
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Company
          </button>
        </div>
      </div>

      {/* Modern Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark transition hover:border-primary/50"
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
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-green">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Table Card Container (Filters + Table + Footer Pagination) */}
      <div className="rounded-2xl border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark overflow-hidden">
        {/* Filters Toolbar inside Table Card Header */}
        <div className="flex flex-col gap-3 p-5 border-b border-stroke dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-dark">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
            <input
              type="text"
              placeholder="Search by company name or code..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 pl-10 pr-4 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
            />
          </div>

          {/* Status Select Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none rounded-xl border border-stroke bg-gray-2 py-2.5 pl-9 pr-9 text-xs font-semibold text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white cursor-pointer transition"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stroke bg-gray-2/60 dark:border-dark-3 dark:bg-dark-2/60">
                <th
                  onClick={() => handleSort("name")}
                  className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2">
                    <span>Company Entity</span>
                    {renderSortIcon("name")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("code")}
                  className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2">
                    <span>Code</span>
                    {renderSortIcon("code")}
                  </div>
                </th>
                <th className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white">
                  Base Currency
                </th>
                <th className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white">
                  Location / Tax ID
                </th>
                <th className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white">
                  Timezone
                </th>
                <th className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white">
                  Status
                </th>
                <th className="py-3.5 px-5 text-right text-xs font-bold text-dark dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-dark-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-5"><div className="h-4 w-32 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-4 w-16 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-4 w-12 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-4 w-28 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-4 w-20 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-4 w-16 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                    <td className="py-4 px-5 text-right"><div className="h-4 w-8 bg-gray-3 dark:bg-dark-3 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-dark-5 dark:text-dark-6">
                    <Building2 className="mx-auto h-8 w-8 text-dark-5 mb-2 opacity-50" />
                    No companies found matching your criteria.
                  </td>
                </tr>
              ) : (
                companies.map((comp) => (
                  <tr
                    key={comp.id}
                    className="hover:bg-gray-2/50 dark:hover:bg-dark-2/50 transition"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                          {comp.code.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-dark dark:text-white">
                            {comp.name}
                          </div>
                          <div className="text-[10px] text-dark-5 dark:text-dark-6">
                            ID: {comp.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-mono text-xs font-semibold text-dark dark:text-white bg-gray-2 dark:bg-dark-2 px-2.5 py-1 rounded-md border border-stroke dark:border-dark-3">
                        {comp.code}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-primary">
                        {comp.baseCurrency}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <div className="text-xs text-dark dark:text-white flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-dark-5" />
                        {comp.city || comp.country ? (
                          <span>
                            {comp.city ? `${comp.city}, ` : ""}
                            {comp.country}
                          </span>
                        ) : (
                          <span className="text-dark-5">—</span>
                        )}
                      </div>
                      {comp.taxId && (
                        <div className="text-[10px] text-dark-5 font-mono">
                          Tax ID: {comp.taxId}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-5 text-xs text-dark dark:text-white">
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-dark-5" />
                        <span>{comp.timezone || "Asia/Kolkata"}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      {comp.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-semibold text-green dark:bg-green-950/40">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => {
                          setSelectedCompany(comp);
                          setIsEditModalOpen(true);
                        }}
                        title="Edit Company"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-stroke bg-white px-3 py-1.5 text-xs font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 transition shadow-xs"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-primary" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Embedded Pagination in Table Card Footer */}
        <Pagination
          embedded
          currentPage={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />
      </div>

      {/* Modals */}
      <CreateCompanyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCompany}
        isSubmitting={isSubmitting}
      />

      <EditCompanyModal
        isOpen={isEditModalOpen}
        company={selectedCompany}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCompany(null);
        }}
        onSubmit={handleUpdateCompany}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
