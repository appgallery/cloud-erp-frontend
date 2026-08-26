"use client";

import React from "react";
import { RoleDto } from "@/lib/api/types";
import { Search, Copy, Eye, Archive, RotateCcw } from "lucide-react";
import { clsx } from "clsx";

interface RoleListSidebarProps {
  roles: RoleDto[];
  loading: boolean;
  selectedRole: RoleDto | null;
  activeTab: "all" | "active" | "archived" | "templates";
  setActiveTab: (tab: "all" | "active" | "archived" | "templates") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelectRole: (role: RoleDto) => void;
  onOpenCloneModal: (role: RoleDto) => void;
  onOpenAuditModal: (role: RoleDto) => void;
  onToggleArchive: (role: RoleDto) => void;
}

export function RoleListSidebar({
  roles,
  loading,
  selectedRole,
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  onSelectRole,
  onOpenCloneModal,
  onOpenAuditModal,
  onToggleArchive,
}: RoleListSidebarProps) {
  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    if (activeTab === "active") return !role.isArchived;
    if (activeTab === "archived") return role.isArchived;
    if (activeTab === "templates") return role.isTemplate;
    return true;
  });

  return (
    <div className="rounded-2xl border border-stroke bg-white p-4 sm:p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      {/* Filter Tabs */}
      <div className="mb-4 flex flex-wrap gap-1 border-b border-stroke pb-2 text-xs font-semibold dark:border-dark-3">
        {(["active", "templates", "archived", "all"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "rounded-lg px-3 py-1.5 transition capitalize",
              activeTab === tab
                ? "bg-primary/10 text-primary font-bold dark:bg-primary/20"
                : "text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            )}
          >
            {tab === "all" ? `All (${roles.length})` : tab}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
        <input
          type="text"
          placeholder="Search roles by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 pl-9 pr-3 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* Role Cards List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-dark-5">
          Loading roles catalog...
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="py-12 text-center text-xs text-dark-5">
          No roles found matching criteria.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
          {filteredRoles.map((role) => {
            const isSelected = selectedRole?.id === role.id;

            return (
              <div
                key={role.id}
                onClick={() => onSelectRole(role)}
                className={clsx(
                  "group relative cursor-pointer rounded-xl border p-4 transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xs dark:bg-primary/10"
                    : "border-stroke bg-white hover:border-primary/50 dark:border-dark-3 dark:bg-gray-dark dark:hover:border-primary/50"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="text-sm font-bold text-dark dark:text-white">
                        {role.name}
                      </h4>

                      {role.isTemplate ? (
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">
                          Template
                        </span>
                      ) : role.isOwnerRole ? (
                        <span className="rounded bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-500">
                          Owner
                        </span>
                      ) : (
                        <span className="rounded bg-gray-2 px-2 py-0.5 text-[10px] font-bold text-dark-5 dark:bg-dark-3 dark:text-dark-6">
                          Custom
                        </span>
                      )}

                      {role.isArchived && (
                        <span className="rounded bg-red/10 px-2 py-0.5 text-[10px] font-bold text-red">
                          Archived
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-dark-5 dark:text-dark-6 line-clamp-2">
                      {role.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      title="Clone Role"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCloneModal(role);
                      }}
                      className="rounded-lg p-1.5 text-dark-5 hover:bg-primary/10 hover:text-primary dark:hover:bg-dark-3"
                    >
                      <Copy className="h-4 w-4" />
                    </button>

                    <button
                      title="Usage & Audit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAuditModal(role);
                      }}
                      className="rounded-lg p-1.5 text-dark-5 hover:bg-primary/10 hover:text-primary dark:hover:bg-dark-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {role.isEditable && !role.isOwnerRole && (
                      <button
                        title={role.isArchived ? "Restore" : "Archive"}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleArchive(role);
                        }}
                        className="rounded-lg p-1.5 text-dark-5 hover:bg-red/10 hover:text-red dark:hover:bg-dark-3"
                      >
                        {role.isArchived ? (
                          <RotateCcw className="h-4 w-4 text-green" />
                        ) : (
                          <Archive className="h-4 w-4 text-red" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-dark-5 dark:text-dark-6">
                  <span>Assigned Users: {role.assignedUserCount ?? 0}</span>
                  <span>Permissions: {role.permissionCodes?.length || 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
