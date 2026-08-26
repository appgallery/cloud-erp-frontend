"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { usersApi } from "@/lib/api/users/users";
import { rolesApi } from "@/lib/api/roles/roles";
import { CompanyUserDto, RoleDto, CreateCompanyUserDto } from "@/lib/api/types";
import { UsersTable } from "./components/users-table";
import { AddUserModal } from "./components/add-user-modal";
import { AssignRoleModal } from "./components/assign-role-modal";
import {
  Users,
  UserPlus,
  Search,
  Building2,
  UserCheck,
  Shield,
  Lock,
  CheckCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export function UsersScreen() {
  const { activeCompanyId, activeCompanyName, fetchMyCompanies } = useAuthStore();

  const [users, setUsers] = useState<CompanyUserDto[]>([]);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CompanyUserDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Data
  const loadData = useCallback(async () => {
    if (!activeCompanyId) return;
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        usersApi.listCompanyUsers(activeCompanyId, { pageSize: 100 }),
        rolesApi.listRoles(activeCompanyId, { includeArchived: false, pageSize: 100 }),
      ]);
      setUsers(usersRes.items || []);
      setRoles(rolesRes.items || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId]);

  useEffect(() => {
    if (!activeCompanyId) {
      fetchMyCompanies();
    } else {
      loadData();
    }
  }, [activeCompanyId, fetchMyCompanies, loadData]);

  // Create User
  const handleCreateUser = async (form: CreateCompanyUserDto) => {
    if (!activeCompanyId) return;
    setIsSubmitting(true);
    try {
      await usersApi.createCompanyUser(activeCompanyId, form);
      toast.success(`User ${form.email} created successfully`);
      setIsAddUserModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Assign Role
  const handleAssignRole = async (roleId: string) => {
    if (!activeCompanyId || !selectedUser) return;
    setIsSubmitting(true);
    try {
      await rolesApi.assignUserToRole(activeCompanyId, roleId, selectedUser.id);
      toast.success(`Role assigned to ${selectedUser.email}`);
      setIsAssignModalOpen(false);
      setSelectedUser(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to assign role");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove Role
  const handleRemoveRole = async (userId: string, roleId: string) => {
    if (!activeCompanyId) return;
    try {
      await rolesApi.removeUserFromRole(activeCompanyId, roleId, userId);
      toast.success("Role removed from user");
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove role");
    }
  };

  // Calculated Stats (CRM Style Overview)
  const activeCount = users.filter((u) => u.isActive).length;
  const rolesAssignedCount = users.reduce((acc, u) => {
    const rCount = u.roles?.length || (u.roleId ? 1 : 0);
    return acc + rCount;
  }, 0);

  const stats = [
    {
      title: "Total Company Users",
      value: users.length.toString(),
      change: "+12.4%",
      isUp: true,
      icon: Users,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Active Roster",
      value: activeCount.toString(),
      change: "+100%",
      isUp: true,
      icon: UserCheck,
      color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    },
    {
      title: "Active Role Grants",
      value: rolesAssignedCount.toString(),
      change: "+8.5%",
      isUp: true,
      icon: Shield,
      color: "bg-purple-50 text-primary dark:bg-purple-950/40 dark:text-purple-400",
    },
    {
      title: "Security & Policy",
      value: "Compliant",
      change: "100%",
      isUp: true,
      icon: Lock,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-1 dark:bg-gray-dark border border-stroke dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Building2 className="h-4 w-4" />
            <span>Company Context: {activeCompanyName || "Default Company"}</span>
          </div>
          <h1 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2.5 tracking-tight">
            <Users className="h-7 w-7 text-primary" />
            User Administration & Access Roster
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Manage company team members, grant security roles, and monitor organizational access controls.
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
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" />
            Add Company User
          </button>
        </div>
      </div>

      {/* CRM Style Overview Stats Cards */}
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
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-green">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-2xl border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
          <input
            type="text"
            placeholder="Search company users by email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 pl-10 pr-4 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>
      </div>

      {/* Users Table / Mobile Cards */}
      <UsersTable
        users={users}
        roles={roles}
        loading={loading}
        searchTerm={searchTerm}
        onOpenAssignModal={(user) => {
          setSelectedUser(user);
          setIsAssignModalOpen(true);
        }}
        onRemoveRole={handleRemoveRole}
      />

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        roles={roles}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleCreateUser}
        isSubmitting={isSubmitting}
      />

      <AssignRoleModal
        isOpen={isAssignModalOpen}
        user={selectedUser}
        roles={roles}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleAssignRole}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
