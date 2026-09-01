"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { regionsApi } from "@/lib/api/regions/regions";
import { RegionDto, CreateRegionDto, UpdateRegionDto, RegionTreeNode } from "@/lib/api/types";
import { Pagination } from "@/components/common/pagination";
import { CreateRegionModal } from "./components/create-region-modal";
import { EditRegionModal } from "./components/edit-region-modal";
import { RegionTreeView } from "./components/region-tree-view";
import {
  Map,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  GitBranch,
  CheckCircle2,
  XCircle,
  TrendingUp,
  LayoutList,
  Network,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { NativeSelect } from "@/components/forms/select";

export function RegionsScreen() {
  const { activeCompanyId, activeCompanyName, fetchMyCompanies } = useAuthStore();

  const [regions, setRegions] = useState<RegionDto[]>([]);
  const [treeNodes, setTreeNodes] = useState<RegionTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // View Mode
  const [viewMode, setViewMode] = useState<"table" | "tree">("table");

  // Pagination & Filter State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "code" | "createdAt">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Regions Data
  const loadData = useCallback(async () => {
    if (!activeCompanyId) return;
    setLoading(true);
    try {
      const [listRes, treeRes] = await Promise.all([
        regionsApi.listRegions(activeCompanyId, {
          page,
          pageSize,
          search: searchTerm || undefined,
          sortBy,
          sortDir,
          isActive: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
        }),
        regionsApi.getRegionTree(activeCompanyId),
      ]);

      setRegions(listRes.items || []);
      setTotalItems(listRes.total || 0);
      setTreeNodes(treeRes || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load regions");
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, page, pageSize, searchTerm, sortBy, sortDir, statusFilter]);

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

  const handleCreateRegion = async (dto: CreateRegionDto) => {
    if (!activeCompanyId) return;
    setIsSubmitting(true);
    try {
      await regionsApi.createRegion(activeCompanyId, dto);
      toast.success(`Region "${dto.name}" created successfully`);
      setIsCreateModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create region");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRegion = async (regionId: string, dto: UpdateRegionDto) => {
    if (!activeCompanyId) return;
    setIsSubmitting(true);
    try {
      await regionsApi.updateRegion(activeCompanyId, regionId, dto);
      toast.success("Region updated successfully");
      setIsEditModalOpen(false);
      setSelectedRegion(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update region");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditByTreeId = (regionId: string) => {
    const found = regions.find((r) => r.id === regionId);
    if (found) {
      setSelectedRegion(found);
      setIsEditModalOpen(true);
    } else {
      regionsApi
        .getRegion(activeCompanyId!, regionId)
        .then((res) => {
          setSelectedRegion(res);
          setIsEditModalOpen(true);
        })
        .catch(() => toast.error("Could not load region detail"));
    }
  };

  const activeCount = regions.filter((r) => r.isActive).length;

  const stats = [
    {
      title: "Total Regions",
      value: totalItems.toString(),
      change: "Territory Roster",
      icon: Map,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Active Status",
      value: `${activeCount} / ${regions.length}`,
      change: "Active Roster",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    },
    {
      title: "Hierarchy Roots",
      value: treeNodes.length.toString(),
      change: "Up to 3 Levels",
      icon: GitBranch,
      color: "bg-purple-50 text-primary dark:bg-purple-950/40 dark:text-purple-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-1 dark:bg-gray-dark border border-stroke dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Map className="h-4 w-4" />
            <span>Company Context: {activeCompanyName || "Current Company"}</span>
          </div>
          <h1 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2.5 tracking-tight">
            Region & Territory Management
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Organize geographic sales zones and regional branch hierarchies up to 3 levels deep.
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
            Add Region
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

      {/* Main Table/Tree Card Container */}
      <div className="rounded-2xl border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark overflow-hidden">
        {/* Card Header Toolbar with View Mode & Search */}
        <div className="flex flex-col gap-4 p-5 border-b border-stroke dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-dark">
          {/* View Mode Toggle Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-gray-2 p-1 dark:bg-dark-2">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                viewMode === "table"
                  ? "bg-white text-dark shadow-xs dark:bg-gray-dark dark:text-white"
                  : "text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              <LayoutList className="h-4 w-4" />
              Table View
            </button>
            <button
              onClick={() => setViewMode("tree")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                viewMode === "tree"
                  ? "bg-white text-dark shadow-xs dark:bg-gray-dark dark:text-white"
                  : "text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              <Network className="h-4 w-4" />
              Hierarchy Tree View
            </button>
          </div>

          {/* Search & Status Filters for Table View */}
          {viewMode === "table" && (
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="relative min-w-[220px]">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
                <input
                  type="text"
                  placeholder="Search regions..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-xl border border-stroke bg-gray-2 py-2 pl-10 pr-4 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
                />
              </div>

              <div className="w-36">
                <NativeSelect
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  icon={<Filter className="h-3.5 w-3.5" />}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </NativeSelect>
              </div>
            </div>
          )}
        </div>

        {/* View Mode Content */}
        {viewMode === "tree" ? (
          <div>
            <div className="p-4 bg-gray-2/40 dark:bg-dark-2/40 border-b border-stroke dark:border-dark-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-dark dark:text-white flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" /> Interactive Region Hierarchy Tree
              </h3>
              <span className="text-[11px] text-dark-5 dark:text-dark-6">
                Click nodes to expand/collapse parent regions
              </span>
            </div>
            <RegionTreeView nodes={treeNodes} onEditRegion={handleEditByTreeId} />
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-[650px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-stroke bg-gray-2/60 dark:border-dark-3 dark:bg-dark-2/60">
                    <th
                      onClick={() => handleSort("name")}
                      className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white cursor-pointer select-none group whitespace-nowrap"
                    >
                      <div className="flex items-center gap-2">
                        <span>Region Name</span>
                        {renderSortIcon("name")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("code")}
                      className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white cursor-pointer select-none group whitespace-nowrap"
                    >
                      <div className="flex items-center gap-2">
                        <span>Code</span>
                        {renderSortIcon("code")}
                      </div>
                    </th>
                    <th className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white whitespace-nowrap">
                      Parent Region
                    </th>
                    <th className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white whitespace-nowrap">
                      Status
                    </th>
                    <th className="py-3.5 px-5 text-right text-xs font-bold text-dark dark:text-white whitespace-nowrap">
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
                        <td className="py-4 px-5"><div className="h-4 w-24 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                        <td className="py-4 px-5"><div className="h-4 w-16 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                        <td className="py-4 px-5 text-right"><div className="h-4 w-8 bg-gray-3 dark:bg-dark-3 rounded ml-auto"></div></td>
                      </tr>
                    ))
                  ) : regions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs text-dark-5 dark:text-dark-6">
                        <Map className="mx-auto h-8 w-8 text-dark-5 mb-2 opacity-50" />
                        No regions found for this company.
                      </td>
                    </tr>
                  ) : (
                    regions.map((reg) => (
                      <tr
                        key={reg.id}
                        className="hover:bg-gray-2/50 dark:hover:bg-dark-2/50 transition"
                      >
                        <td className="py-4 px-5">
                          <div className="font-semibold text-xs text-dark dark:text-white flex items-center gap-2">
                            <Map className="h-4 w-4 text-primary" />
                            {reg.name}
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <span className="font-mono text-xs font-semibold text-dark dark:text-white bg-gray-2 dark:bg-dark-2 px-2.5 py-1 rounded-md border border-stroke dark:border-dark-3">
                            {reg.code}
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          {reg.parent ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-dark dark:text-white">
                              <GitBranch className="h-3 w-3 text-dark-5" />
                              {reg.parent.name} ({reg.parent.code})
                            </span>
                          ) : (
                            <span className="text-xs text-dark-5 italic">Top Level</span>
                          )}
                        </td>

                        <td className="py-4 px-5">
                          {reg.isActive ? (
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
                              setSelectedRegion(reg);
                              setIsEditModalOpen(true);
                            }}
                            title="Edit Region"
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
          </>
        )}
      </div>

      {/* Modals */}
      <CreateRegionModal
        isOpen={isCreateModalOpen}
        regionsList={regions}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRegion}
        isSubmitting={isSubmitting}
      />

      <EditRegionModal
        isOpen={isEditModalOpen}
        region={selectedRegion}
        regionsList={regions}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRegion(null);
        }}
        onSubmit={handleUpdateRegion}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
