"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { branchesApi } from "@/lib/api/branches/branches";
import { departmentsApi } from "@/lib/api/departments/departments";
import { usersApi } from "@/lib/api/users/users";
import {
  BranchDto,
  DepartmentDto,
  DepartmentTreeNode,
  CompanyUserDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "@/lib/api/types";
import { Pagination } from "@/components/common/pagination";
import { CreateDepartmentModal } from "./components/create-department-modal";
import { EditDepartmentModal } from "./components/edit-department-modal";
import { DepartmentTreeView } from "./components/department-tree-view";
import {
  FolderTree,
  Building,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  User,
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
  Building2,
} from "lucide-react";
import { toast } from "sonner";

export function DepartmentsScreen() {
  const { activeCompanyId, activeCompanyName, fetchMyCompanies } = useAuthStore();

  // Branch Selection
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [branchesLoading, setBranchesLoading] = useState(true);

  // Department Data
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [tree, setTree] = useState<DepartmentTreeNode[]>([]);
  const [users, setUsers] = useState<CompanyUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // View Mode
  const [viewMode, setViewMode] = useState<"tree" | "table">("tree");

  // Table Filters & Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "code" | "createdAt">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals & Action State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createParentId, setCreateParentId] = useState<string | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Load Branches for current company
  const loadBranches = useCallback(async () => {
    if (!activeCompanyId) return;
    setBranchesLoading(true);
    try {
      const res = await branchesApi.listBranches(activeCompanyId, {
        pageSize: 100,
        isActive: true,
      });
      const branchItems = res.items || [];
      setBranches(branchItems);
      if (branchItems.length > 0 && !selectedBranchId) {
        setSelectedBranchId(branchItems[0].id);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load branches");
    } finally {
      setBranchesLoading(false);
    }
  }, [activeCompanyId, selectedBranchId]);

  // 2. Load Department Data (List + Tree + Users)
  const loadDepartmentData = useCallback(async () => {
    if (!activeCompanyId || !selectedBranchId) return;
    setLoading(true);
    try {
      const [listRes, treeRes, usersRes] = await Promise.all([
        departmentsApi.listDepartments(activeCompanyId, selectedBranchId, {
          page,
          pageSize,
          search: searchTerm || undefined,
          sortBy,
          sortDir,
          isActive: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
        }),
        departmentsApi.getDepartmentTree(activeCompanyId, selectedBranchId),
        usersApi.listCompanyUsers(activeCompanyId, { pageSize: 100, isActive: true }),
      ]);

      setDepartments(listRes.items || []);
      setTotalItems(listRes.total || 0);
      setTree(treeRes || []);
      setUsers(usersRes.items || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, selectedBranchId, page, pageSize, searchTerm, sortBy, sortDir, statusFilter]);

  useEffect(() => {
    if (!activeCompanyId) {
      fetchMyCompanies();
    } else {
      loadBranches();
    }
  }, [activeCompanyId, fetchMyCompanies, loadBranches]);

  useEffect(() => {
    if (selectedBranchId) {
      loadDepartmentData();
    }
  }, [selectedBranchId, loadDepartmentData]);

  // Sorting
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

  // Actions
  const handleCreateDepartment = async (dto: CreateDepartmentDto) => {
    if (!activeCompanyId || !selectedBranchId) return;
    setIsSubmitting(true);
    try {
      await departmentsApi.createDepartment(activeCompanyId, selectedBranchId, dto);
      toast.success(`Department "${dto.name}" created successfully`);
      setIsCreateModalOpen(false);
      setCreateParentId(undefined);
      await loadDepartmentData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create department");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDepartment = async (departmentId: string, dto: UpdateDepartmentDto) => {
    if (!activeCompanyId || !selectedBranchId) return;
    setIsSubmitting(true);
    try {
      await departmentsApi.updateDepartment(activeCompanyId, selectedBranchId, departmentId, dto);
      toast.success("Department updated successfully");
      setIsEditModalOpen(false);
      setSelectedDepartment(null);
      await loadDepartmentData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update department");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDepartment = async (departmentId: string, name: string) => {
    if (!activeCompanyId || !selectedBranchId) return;
    if (!confirm(`Are you sure you want to remove the department "${name}"?`)) return;

    try {
      await departmentsApi.deleteDepartment(activeCompanyId, selectedBranchId, departmentId);
      toast.success(`Department "${name}" removed`);
      await loadDepartmentData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete department");
    }
  };

  const handleOpenEdit = async (departmentId: string) => {
    if (!activeCompanyId || !selectedBranchId) return;
    try {
      const dept = await departmentsApi.getDepartment(activeCompanyId, selectedBranchId, departmentId);
      setSelectedDepartment(dept);
      setIsEditModalOpen(true);
    } catch (err: any) {
      toast.error("Failed to load department details");
    }
  };

  const currentBranch = branches.find((b) => b.id === selectedBranchId);
  const activeCount = departments.filter((d) => d.isActive).length;
  const rootCount = tree.length;

  const usersMap = new Map(users.map((u) => [u.id, u.email]));

  const stats = [
    {
      title: "Branch Departments",
      value: totalItems.toString(),
      change: currentBranch?.name || "Active Branch",
      icon: FolderTree,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Root Units",
      value: rootCount.toString(),
      change: "Top-Level Org Units",
      icon: Network,
      color: "bg-purple-50 text-primary dark:bg-purple-950/40 dark:text-purple-400",
    },
    {
      title: "Operational Status",
      value: `${activeCount} / ${departments.length}`,
      change: "Active Units",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-1 dark:bg-gray-dark border border-stroke dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Building2 className="h-4 w-4" />
            <span>Company Context: {activeCompanyName || "Current Company"}</span>
          </div>
          <h1 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2.5 tracking-tight">
            Department Hierarchy & Org Units
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Manage functional divisions, team leads, reporting structures, and organizational trees.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Branch Picker */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedBranchId}
              onChange={(e) => {
                setSelectedBranchId(e.target.value);
                setPage(1);
              }}
              disabled={branchesLoading || branches.length === 0}
              className="w-full appearance-none rounded-xl border border-stroke bg-gray-2 py-2.5 pl-9 pr-9 text-xs font-bold text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white cursor-pointer transition"
            >
              {branches.length === 0 ? (
                <option value="">No Branches Available</option>
              ) : (
                branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))
              )}
            </select>
            <Building className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
          </div>

          <button
            onClick={loadDepartmentData}
            title="Refresh Data"
            className="flex items-center gap-2 rounded-xl border border-stroke bg-white px-3.5 py-2.5 text-xs font-semibold text-dark shadow-xs hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white transition cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-primary" : ""}`} />
            Sync
          </button>

          <button
            onClick={() => {
              setCreateParentId(undefined);
              setIsCreateModalOpen(true);
            }}
            disabled={!selectedBranchId}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Department
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

      {/* Main Container with View Switcher */}
      <div className="rounded-2xl border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark overflow-hidden">
        {/* Header Toolbar */}
        <div className="flex flex-col gap-3 p-5 border-b border-stroke dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-dark">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-gray-2 p-1 dark:bg-dark-2">
            <button
              onClick={() => setViewMode("tree")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                viewMode === "tree"
                  ? "bg-white text-primary shadow-xs dark:bg-gray-dark dark:text-white"
                  : "text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              Hierarchy Tree
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-primary shadow-xs dark:bg-gray-dark dark:text-white"
                  : "text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }`}
            >
              <LayoutList className="h-3.5 w-3.5" />
              Roster Table
            </button>
          </div>

          {/* Search & Status Filter */}
          <div className="flex items-center gap-3 flex-wrap flex-1 sm:justify-end">
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-2 pl-10 pr-4 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none rounded-xl border border-stroke bg-gray-2 py-2 pl-8 pr-8 text-xs font-semibold text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white cursor-pointer transition"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {branches.length === 0 ? (
            <div className="py-12 text-center text-xs text-dark-5 dark:text-dark-6">
              <Building className="mx-auto h-8 w-8 text-dark-5 mb-2 opacity-50" />
              No branches found. Please create a branch in this company first before managing departments.
            </div>
          ) : viewMode === "tree" ? (
            <DepartmentTreeView
              tree={tree}
              users={users}
              onAddChild={(parentId) => {
                setCreateParentId(parentId);
                setIsCreateModalOpen(true);
              }}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteDepartment}
            />
          ) : (
            <div className="space-y-4">
              <div className="max-w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stroke bg-gray-2/60 dark:border-dark-3 dark:bg-dark-2/60">
                      <th
                        onClick={() => handleSort("name")}
                        className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white cursor-pointer select-none group"
                      >
                        <div className="flex items-center gap-2">
                          <span>Department Name</span>
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
                        Parent Unit
                      </th>
                      <th className="py-3.5 px-5 text-xs font-bold text-dark dark:text-white">
                        Department Head
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
                          <td className="py-4 px-5"><div className="h-4 w-24 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                          <td className="py-4 px-5"><div className="h-4 w-28 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                          <td className="py-4 px-5"><div className="h-4 w-16 bg-gray-3 dark:bg-dark-3 rounded"></div></td>
                          <td className="py-4 px-5 text-right"><div className="h-4 w-8 bg-gray-3 dark:bg-dark-3 rounded ml-auto"></div></td>
                        </tr>
                      ))
                    ) : departments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-xs text-dark-5 dark:text-dark-6">
                          <FolderTree className="mx-auto h-8 w-8 text-dark-5 mb-2 opacity-50" />
                          No departments found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      departments.map((dept) => {
                        const headEmail = dept.headUserId ? usersMap.get(dept.headUserId) : null;

                        return (
                          <tr
                            key={dept.id}
                            className="hover:bg-gray-2/50 dark:hover:bg-dark-2/50 transition"
                          >
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                  <FolderTree className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-semibold text-xs text-dark dark:text-white">
                                    {dept.name}
                                  </div>
                                  {dept.description && (
                                    <div className="text-[10px] text-dark-5 truncate max-w-xs">
                                      {dept.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-5">
                              <span className="font-mono text-xs font-semibold text-dark dark:text-white bg-gray-2 dark:bg-dark-2 px-2.5 py-1 rounded-md border border-stroke dark:border-dark-3">
                                {dept.code}
                              </span>
                            </td>

                            <td className="py-4 px-5">
                              {dept.parent ? (
                                <span className="inline-flex items-center gap-1 text-xs text-dark dark:text-white">
                                  <FolderTree className="h-3 w-3 text-dark-5" />
                                  {dept.parent.name}
                                </span>
                              ) : (
                                <span className="text-xs text-dark-5 italic">Root (Top-Level)</span>
                              )}
                            </td>

                            <td className="py-4 px-5">
                              {headEmail ? (
                                <span className="inline-flex items-center gap-1 text-xs text-dark dark:text-white">
                                  <User className="h-3 w-3 text-primary" />
                                  {headEmail}
                                </span>
                              ) : (
                                <span className="text-xs text-dark-5 italic">Unassigned</span>
                              )}
                            </td>

                            <td className="py-4 px-5">
                              {dept.isActive ? (
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
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEdit(dept.id)}
                                  title="Edit Department"
                                  className="inline-flex items-center gap-1 rounded-lg border border-stroke bg-white px-2.5 py-1.5 text-xs font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white transition shadow-xs cursor-pointer"
                                >
                                  <Edit2 className="h-3.5 w-3.5 text-primary" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                                  title="Delete Department"
                                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-stroke bg-white text-dark-5 hover:bg-red-50 hover:text-red-600 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition shadow-xs cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Embedded Pagination */}
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
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateDepartmentModal
        isOpen={isCreateModalOpen}
        branchName={currentBranch?.name || "Selected Branch"}
        departments={departments}
        users={users}
        defaultParentId={createParentId}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateParentId(undefined);
        }}
        onSubmit={handleCreateDepartment}
        isSubmitting={isSubmitting}
      />

      <EditDepartmentModal
        isOpen={isEditModalOpen}
        branchName={currentBranch?.name || "Selected Branch"}
        department={selectedDepartment}
        departments={departments}
        users={users}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDepartment(null);
        }}
        onSubmit={handleUpdateDepartment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
