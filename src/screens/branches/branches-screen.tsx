"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { branchesApi } from "@/lib/api/branches/branches";
import { regionsApi } from "@/lib/api/regions/regions";
import { BranchDto, CreateBranchDto, UpdateBranchDto, BranchType, RegionDto } from "@/lib/api/types";
import { Pagination } from "@/components/common/pagination";
import { CreateBranchModal } from "./components/create-branch-modal";
import { EditBranchModal } from "./components/edit-branch-modal";
import {
  Building,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  MapPin,
  Map,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Phone,
  Mail,
  ShieldAlert,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

const TYPE_BADGES: Record<BranchType, { label: string; style: string }> = {
  HEAD_OFFICE: {
    label: "Head Office",
    style: "bg-purple-50 text-primary border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800",
  },
  SALES: {
    label: "Sales Office",
    style: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
  },
  WAREHOUSE: {
    label: "Warehouse",
    style: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  },
  SERVICE_CENTER: {
    label: "Service Center",
    style: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
  FACTORY: {
    label: "Factory",
    style: "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800",
  },
};

export function BranchesScreen() {
  const { activeCompanyId, activeCompanyName, fetchMyCompanies } = useAuthStore();

  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [regions, setRegions] = useState<RegionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "code" | "city" | "state" | "createdAt">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Load Data
  const loadData = useCallback(async () => {
    if (!activeCompanyId) return;
    setLoading(true);
    try {
      const [branchesRes, regionsRes] = await Promise.all([
        branchesApi.listBranches(activeCompanyId, {
          page,
          pageSize,
          search: searchTerm || undefined,
          type: typeFilter !== "all" ? (typeFilter as BranchType) : undefined,
          regionId: regionFilter !== "all" ? regionFilter : undefined,
          isActive: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
          sortBy,
          sortDir,
        }),
        regionsApi.listRegions(activeCompanyId, { pageSize: 100, isActive: true }),
      ]);

      setBranches(branchesRes.items || []);
      setTotalItems(branchesRes.total || 0);
      setRegions(regionsRes.items || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load branches");
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, page, pageSize, searchTerm, typeFilter, regionFilter, statusFilter, sortBy, sortDir]);

  useEffect(() => {
    if (!activeCompanyId) {
      fetchMyCompanies();
    } else {
      loadData();
    }
  }, [activeCompanyId, fetchMyCompanies, loadData]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleSort = (field: "name" | "code" | "city" | "state" | "createdAt") => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const renderSortIcon = (field: "name" | "code" | "city" | "state" | "createdAt") => {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-3 w-3 text-dark-5 opacity-40 group-hover:opacity-100 transition" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary" />
    );
  };

  const handleCreateBranch = async (dto: CreateBranchDto) => {
    if (!activeCompanyId) return;
    setIsSubmitting(true);
    try {
      await branchesApi.createBranch(activeCompanyId, dto);
      toast.success(`Branch "${dto.name}" created successfully`);
      setIsCreateModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create branch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBranch = async (branchId: string, dto: UpdateBranchDto) => {
    if (!activeCompanyId) return;
    setIsSubmitting(true);
    try {
      await branchesApi.updateBranch(activeCompanyId, branchId, dto);
      toast.success("Branch updated successfully");
      setIsEditModalOpen(false);
      setSelectedBranch(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update branch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (branch: BranchDto) => {
    if (!activeCompanyId) return;
    setTogglingId(branch.id);
    try {
      if (branch.isActive) {
        await branchesApi.deactivateBranch(activeCompanyId, branch.id);
        toast.success(`Branch "${branch.name}" deactivated`);
      } else {
        await branchesApi.activateBranch(activeCompanyId, branch.id);
        toast.success(`Branch "${branch.name}" activated`);
      }
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to toggle branch status");
    } finally {
      setTogglingId(null);
    }
  };

  const activeCount = branches.filter((b) => b.isActive).length;
  const headOfficeCount = branches.filter((b) => b.type === "HEAD_OFFICE").length;

  const stats = [
    {
      title: "Total Company Branches",
      value: totalItems.toString(),
      change: "Active Org Roster",
      icon: Building,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Active Locations",
      value: `${activeCount} / ${branches.length}`,
      change: "Operational",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    },
    {
      title: "Head Offices",
      value: headOfficeCount.toString(),
      change: "Main Hub",
      icon: ShieldAlert,
      color: "bg-purple-50 text-primary dark:bg-purple-950/40 dark:text-purple-400",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-1 dark:bg-gray-dark border border-stroke dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Building className="h-4 w-4" />
            <span>Company Context: {activeCompanyName || "Current Company"}</span>
          </div>
          <h1 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2.5 tracking-tight">
            Branch Locations & Hubs
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Manage head offices, sales branches, regional warehouses, and location contact rosters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
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
            Add Branch
          </button>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Main Table Card Container (Filters + Table + Embedded Footer Pagination) */}
      <div className="rounded-2xl border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark overflow-hidden">
        {/* Filters Toolbar inside Table Card Header */}
        <div className="p-5 border-b border-stroke dark:border-dark-3 bg-white dark:bg-gray-dark">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
              <input
                type="text"
                placeholder="Search by branch name or code..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 pl-10 pr-4 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none rounded-xl border border-stroke bg-gray-2 py-2.5 pl-8 pr-8 text-xs font-semibold text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white cursor-pointer transition"
              >
                <option value="all">All Branch Types</option>
                <option value="HEAD_OFFICE">Head Office</option>
                <option value="SALES">Sales Office</option>
                <option value="WAREHOUSE">Warehouse</option>
                <option value="SERVICE_CENTER">Service Center</option>
                <option value="FACTORY">Factory</option>
              </select>
              <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
            </div>

            {/* Region Filter */}
            <div className="relative">
              <select
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none rounded-xl border border-stroke bg-gray-2 py-2.5 pl-8 pr-8 text-xs font-semibold text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white cursor-pointer transition"
              >
                <option value="all">All Regions</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <Map className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
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
                    <span>Branch Name & Code</span>
                    {renderSortIcon("name")}
                  </div>
                </th>
                <th className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white">
                  Type
                </th>
                <th className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white">
                  Region
                </th>
                <th
                  onClick={() => handleSort("city")}
                  className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2">
                    <span>City & Location</span>
                    {renderSortIcon("city")}
                  </div>
                </th>
                <th className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white">
                  Contact
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
                    <td className="py-4 px-5"><div className="h-4 w-36 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-4 w-20 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-4 w-24 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-4 w-28 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-4 w-20 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-4 w-16 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                    <td className="py-4 px-5 text-right"><div className="h-4 w-8 bg-gray-3 dark:bg-dark-3 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : branches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-dark-5 dark:text-dark-6">
                    <Building className="mx-auto h-8 w-8 text-dark-5 mb-2 opacity-50" />
                    No branch locations found for this company.
                  </td>
                </tr>
              ) : (
                branches.map((b) => {
                  const typeInfo = TYPE_BADGES[b.type] || {
                    label: b.type,
                    style: "bg-gray-2 text-dark",
                  };

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-gray-2/50 dark:hover:bg-dark-2/50 transition"
                    >
                      <td className="py-4 px-5">
                        <div className="font-semibold text-xs text-dark dark:text-white flex items-center gap-2">
                          <Building className="h-4 w-4 text-primary" />
                          {b.name}
                        </div>
                        <div className="mt-1">
                          <span className="font-mono text-[10px] font-semibold text-dark-5 dark:text-dark-6 bg-gray-2 dark:bg-dark-2 px-2 py-0.5 rounded border border-stroke dark:border-dark-3">
                            {b.code}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${typeInfo.style}`}
                        >
                          {typeInfo.label}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        {b.region ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-dark dark:text-white">
                            <Map className="h-3 w-3 text-dark-5" />
                            {b.region.name}
                          </span>
                        ) : (
                          <span className="text-xs text-dark-5 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <div className="text-xs font-medium text-dark dark:text-white flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-dark-5" />
                          {b.city}, {b.state}
                        </div>
                        <div className="text-[10px] text-dark-5">{b.country}</div>
                      </td>

                      <td className="py-4 px-5">
                        {b.phone && (
                          <div className="text-[11px] text-dark dark:text-white flex items-center gap-1">
                            <Phone className="h-3 w-3 text-dark-5" />
                            {b.phone}
                          </div>
                        )}
                        {b.email && (
                          <div className="text-[11px] text-dark-5 flex items-center gap-1">
                            <Mail className="h-3 w-3 text-dark-5" />
                            {b.email}
                          </div>
                        )}
                        {!b.phone && !b.email && (
                          <span className="text-xs text-dark-5">—</span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <button
                          onClick={() => handleToggleActive(b)}
                          disabled={togglingId === b.id}
                          title={b.isActive ? "Deactivate Branch" : "Activate Branch"}
                          className="flex items-center gap-1.5 transition cursor-pointer"
                        >
                          {b.isActive ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-semibold text-green dark:bg-green-950/40 hover:bg-green-100 transition">
                              <CheckCircle2 className="h-3 w-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-100 transition">
                              <XCircle className="h-3 w-3" /> Inactive
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => {
                            setSelectedBranch(b);
                            setIsEditModalOpen(true);
                          }}
                          title="Edit Branch"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-stroke bg-white px-3 py-1.5 text-xs font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 transition shadow-xs"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-primary" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
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
      <CreateBranchModal
        isOpen={isCreateModalOpen}
        regionsList={regions}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBranch}
        isSubmitting={isSubmitting}
      />

      <EditBranchModal
        isOpen={isEditModalOpen}
        branch={selectedBranch}
        regionsList={regions}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBranch(null);
        }}
        onSubmit={handleUpdateBranch}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
