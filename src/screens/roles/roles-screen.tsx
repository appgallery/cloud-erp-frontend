"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { rolesApi } from "@/lib/api/roles/roles";
import { permissionsApi } from "@/lib/api/permissions/permissions";
import { RoleDto, PermissionItem, CreateRoleDto } from "@/lib/api/types";
import { RolePermissionMatrix } from "@/components/roles/role-permission-matrix";
import { RoleAuditModal } from "@/components/roles/role-audit-modal";
import { RoleListSidebar } from "./components/role-list-sidebar";
import { CreateRoleModal } from "./components/create-role-modal";
import { CloneRoleModal } from "./components/clone-role-modal";
import {
  Shield,
  Plus,
  Copy,
  Edit3,
  Lock,
  Building2,
  ListFilter,
  SlidersHorizontal,
  Archive,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { clsx } from "clsx";

export function RolesScreen() {
  const { activeCompanyId, activeCompanyName, fetchMyCompanies } = useAuthStore();

  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [permissionsCatalog, setPermissionsCatalog] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "archived" | "templates">("active");

  // Mobile layout state: "sidebar" or "matrix"
  const [mobileView, setMobileView] = useState<"sidebar" | "matrix">("sidebar");

  // Selection & Modal States
  const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<string[]>([]);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const [cloneSource, setCloneSource] = useState<RoleDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!activeCompanyId) {
      fetchMyCompanies();
    }
  }, [activeCompanyId, fetchMyCompanies]);

  const loadData = useCallback(async () => {
    if (!activeCompanyId) return;
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        rolesApi.listRoles(activeCompanyId, { includeArchived: true, pageSize: 100 }),
        permissionsApi.listPermissions(activeCompanyId).catch(() => []),
      ]);
      setRoles(rolesRes.items || []);
      setPermissionsCatalog(permsRes || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectRole = async (role: RoleDto) => {
    if (!activeCompanyId) return;
    try {
      const detail = await rolesApi.getRoleDetail(activeCompanyId, role.id);
      setSelectedRole(detail);
      const codes = detail.permissions
        ? detail.permissions.map((p) => p.code)
        : detail.permissionCodes || [];
      setEditingPermissions(codes);
    } catch (err: any) {
      setSelectedRole(role);
      setEditingPermissions(role.permissionCodes || []);
    }
    setMobileView("matrix");
  };

  const handleSavePermissions = async () => {
    if (!activeCompanyId || !selectedRole) return;
    setIsSavingPermissions(true);
    try {
      await rolesApi.updateRolePermissions(activeCompanyId, selectedRole.id, {
        permissionCodes: editingPermissions,
      });
      toast.success(`Permissions updated for ${selectedRole.name}`);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update permissions");
    } finally {
      setIsSavingPermissions(false);
    }
  };

  const handleCreateRole = async (form: CreateRoleDto) => {
    if (!activeCompanyId) return;
    setIsSubmitting(true);
    try {
      await rolesApi.createRole(activeCompanyId, form);
      toast.success(`Role "${form.name}" created successfully`);
      setIsCreateModalOpen(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloneRole = async (form: { name: string; description: string }) => {
    if (!activeCompanyId || !cloneSource) return;
    setIsSubmitting(true);
    try {
      await rolesApi.cloneRole(activeCompanyId, cloneSource.id, form);
      toast.success(`Role cloned as "${form.name}"`);
      setIsCloneModalOpen(false);
      setCloneSource(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to clone role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleArchive = async (role: RoleDto) => {
    if (!activeCompanyId) return;
    try {
      if (role.isArchived) {
        await rolesApi.restoreRole(activeCompanyId, role.id);
        toast.success(`Restored role "${role.name}"`);
      } else {
        await rolesApi.archiveRole(activeCompanyId, role.id, { force: true });
        toast.success(`Archived role "${role.name}"`);
      }
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  // Stats matching CRM style
  const activeRolesCount = roles.filter((r) => !r.isArchived).length;
  const templatesCount = roles.filter((r) => r.isTemplate).length;
  const archivedCount = roles.filter((r) => r.isArchived).length;

  const stats = [
    {
      title: "Active Security Roles",
      value: activeRolesCount.toString(),
      change: "+15.2%",
      isUp: true,
      icon: Shield,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Org System Templates",
      value: templatesCount.toString(),
      change: "Standard",
      isUp: true,
      icon: Copy,
      color: "bg-purple-50 text-primary dark:bg-purple-950/40 dark:text-purple-400",
    },
    {
      title: "Permission Capabilities",
      value: permissionsCatalog.length.toString(),
      change: "Granular",
      isUp: true,
      icon: Lock,
      color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    },
    {
      title: "Archived Roles",
      value: archivedCount.toString(),
      change: "Inactive",
      isUp: true,
      icon: Archive,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-1 dark:bg-gray-dark border border-stroke dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Building2 className="h-4 w-4" />
            <span>Company Context: {activeCompanyName || "Default Company"}</span>
          </div>
          <h1 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2.5 tracking-tight">
            <Shield className="h-7 w-7 text-primary" />
            Roles & Permissions Management
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Configure custom security roles, set permission matrices, clone system templates, archive roles, and audit access history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            title="Sync Roles & Catalog"
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
            Create Custom Role
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

      {/* Mobile View Toggle Switcher (< lg) */}
      <div className="flex rounded-xl bg-gray-2 p-1 gap-2 dark:bg-dark-2 lg:hidden">
        <button
          onClick={() => setMobileView("sidebar")}
          className={clsx(
            "flex flex-1 items-center justify-center gap-2 px-2 rounded-lg py-2 text-xs font-bold transition",
            mobileView === "sidebar"
              ? "bg-white text-primary shadow-xs dark:bg-gray-dark"
              : "text-dark-5 hover:text-dark dark:text-dark-6"
          )}
        >
          <ListFilter className="h-4 w-4" />
          Roles Catalog ({roles.length})
        </button>
        <button
          onClick={() => setMobileView("matrix")}
          className={clsx(
            "flex flex-1 items-center justify-center gap-2 px-2 rounded-lg py-2 text-xs font-bold transition",
            mobileView === "matrix"
              ? "bg-white text-primary shadow-xs dark:bg-gray-dark"
              : "text-dark-5 hover:text-dark dark:text-dark-6"
          )}
        >
          <SlidersHorizontal className="h-6 w-6" />
          Permission Matrix {selectedRole ? `(${selectedRole.name})` : ""}
        </button>
      </div>

      {/* Main Grid: Role List & Permission Matrix */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Role List Sidebar (5 Cols) */}
        <div className={clsx("space-y-4 lg:col-span-5", mobileView === "matrix" && "hidden lg:block")}>
          <RoleListSidebar
            roles={roles}
            loading={loading}
            selectedRole={selectedRole}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSelectRole={handleSelectRole}
            onOpenCloneModal={(role) => {
              setCloneSource(role);
              setIsCloneModalOpen(true);
            }}
            onOpenAuditModal={(role) => {
              setSelectedRole(role);
              setIsAuditModalOpen(true);
            }}
            onToggleArchive={handleToggleArchive}
          />
        </div>

        {/* Right Column: Permission Matrix Editor (7 Cols) */}
        <div className={clsx("lg:col-span-7", mobileView === "sidebar" && "hidden lg:block")}>
          {selectedRole ? (
            <div className="space-y-4">
              {/* Selected Role Status Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-primary/10 p-4 dark:bg-primary/20">
                <div className="flex items-center gap-3">
                  {selectedRole.isEditable ? (
                    <Edit3 className="h-5 w-5 text-primary shrink-0" />
                  ) : (
                    <Lock className="h-5 w-5 text-dark-5 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-dark dark:text-white">
                      Editing Permissions: {selectedRole.name}
                    </h3>
                    <p className="text-xs text-dark-5 dark:text-dark-6">
                      {selectedRole.isEditable
                        ? "Check permissions below and click Save."
                        : "Shared org template - read-only. Clone this role to edit permissions."}
                    </p>
                  </div>
                </div>

                {!selectedRole.isEditable && (
                  <button
                    onClick={() => {
                      setCloneSource(selectedRole);
                      setIsCloneModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 shrink-0"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Clone to Edit
                  </button>
                )}
              </div>

              <RolePermissionMatrix
                allPermissions={permissionsCatalog}
                selectedPermissionCodes={editingPermissions}
                onChange={setEditingPermissions}
                isReadOnly={!selectedRole.isEditable}
                isSaving={isSavingPermissions}
                onSave={handleSavePermissions}
                title={`Permissions for ${selectedRole.name}`}
              />
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-stroke bg-white p-6 text-center shadow-1 dark:border-dark-3 dark:bg-gray-dark">
              <Shield className="h-12 w-12 text-dark-5 opacity-40 mb-3" />
              <h3 className="text-base font-bold text-dark dark:text-white">
                Select a Role to View Permissions
              </h3>
              <p className="mt-1 text-xs text-dark-5 max-w-sm">
                Click on any role card on the left to review its assigned capabilities or toggle individual permissions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRole}
        isSubmitting={isSubmitting}
      />

      <CloneRoleModal
        isOpen={isCloneModalOpen}
        role={cloneSource}
        onClose={() => {
          setIsCloneModalOpen(false);
          setCloneSource(null);
        }}
        onSubmit={handleCloneRole}
        isSubmitting={isSubmitting}
      />

      <RoleAuditModal
        companyId={activeCompanyId || ""}
        role={selectedRole}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}
