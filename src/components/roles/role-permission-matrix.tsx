"use client";

import React, { useState, useMemo } from "react";
import { PermissionItem } from "@/lib/api/types";
import { Search, ShieldAlert, CheckCircle2, Circle, Save } from "lucide-react";
import { clsx } from "clsx";

interface RolePermissionMatrixProps {
  allPermissions: PermissionItem[];
  selectedPermissionCodes: string[];
  onChange: (codes: string[]) => void;
  isReadOnly?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
  title?: string;
  description?: string;
}

export function RolePermissionMatrix({
  allPermissions,
  selectedPermissionCodes,
  onChange,
  isReadOnly = false,
  isSaving = false,
  onSave,
  title = "Permission Catalogue",
  description = "Select the granular permissions to grant to this role.",
}: RolePermissionMatrixProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Group permissions by module/resource
  const groupedPermissions = useMemo(() => {
    const filterText = searchTerm.toLowerCase().trim();
    const filtered = allPermissions.filter((p) => {
      if (!filterText) return true;
      return (
        p.code.toLowerCase().includes(filterText) ||
        p.displayName.toLowerCase().includes(filterText) ||
        p.description?.toLowerCase().includes(filterText) ||
        p.module.toLowerCase().includes(filterText)
      );
    });

    const groups: Record<string, PermissionItem[]> = {};
    filtered.forEach((p) => {
      const groupKey = p.module.toUpperCase();
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(p);
    });
    return groups;
  }, [allPermissions, searchTerm]);

  const togglePermission = (code: string) => {
    if (isReadOnly) return;
    if (selectedPermissionCodes.includes(code)) {
      onChange(selectedPermissionCodes.filter((c) => c !== code));
    } else {
      onChange([...selectedPermissionCodes, code]);
    }
  };

  const toggleCategory = (groupCodes: string[]) => {
    if (isReadOnly) return;
    const allSelected = groupCodes.every((code) =>
      selectedPermissionCodes.includes(code)
    );
    if (allSelected) {
      onChange(
        selectedPermissionCodes.filter((code) => !groupCodes.includes(code))
      );
    } else {
      const newSet = new Set([...selectedPermissionCodes, ...groupCodes]);
      onChange(Array.from(newSet));
    }
  };

  const selectAll = () => {
    if (isReadOnly) return;
    onChange(allPermissions.map((p) => p.code));
  };

  const clearAll = () => {
    if (isReadOnly) return;
    onChange([]);
  };

  return (
    <div className="rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      {/* Header & Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-dark dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-dark-5 dark:text-dark-6">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isReadOnly && (
            <>
              <button
                type="button"
                onClick={selectAll}
                className="rounded-lg border border-stroke px-3 py-1.5 text-xs font-semibold text-dark-5 transition hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-lg border border-stroke px-3 py-1.5 text-xs font-semibold text-dark-5 transition hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                Clear All
              </button>
            </>
          )}

          {onSave && !isReadOnly && (
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Permissions"}
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5 dark:text-dark-6" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter permissions by code, name, or module..."
          className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 pl-10 pr-4 text-xs font-medium text-dark transition focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
      </div>

      {/* Categories & Permission List */}
      {Object.keys(groupedPermissions).length === 0 ? (
        <div className="py-8 text-center text-xs text-dark-5 dark:text-dark-6">
          No matching permissions found.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([moduleName, perms]) => {
            const groupCodes = perms.map((p) => p.code);
            const isAllGroupSelected = groupCodes.every((code) =>
              selectedPermissionCodes.includes(code)
            );
            const isSomeGroupSelected =
              !isAllGroupSelected &&
              groupCodes.some((code) =>
                selectedPermissionCodes.includes(code)
              );

            return (
              <div
                key={moduleName}
                className="overflow-hidden rounded-xl border border-stroke dark:border-dark-3"
              >
                {/* Module Header */}
                <div className="flex items-center justify-between bg-gray-2 px-4 py-3 dark:bg-dark-2">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary dark:bg-primary/20">
                      {moduleName}
                    </span>
                    <span className="text-xs font-semibold text-dark dark:text-white">
                      {perms.length} Permissions
                    </span>
                  </div>

                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => toggleCategory(groupCodes)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      {isAllGroupSelected ? "Deselect Group" : "Select Group"}
                    </button>
                  )}
                </div>

                {/* Permission Rows */}
                <div className="divide-y divide-stroke bg-white dark:divide-dark-3 dark:bg-gray-dark">
                  {perms.map((perm) => {
                    const isSelected = selectedPermissionCodes.includes(
                      perm.code
                    );

                    return (
                      <div
                        key={perm.code}
                        onClick={() => togglePermission(perm.code)}
                        className={clsx(
                          "flex items-start justify-between p-4 transition-colors",
                          !isReadOnly && "cursor-pointer hover:bg-gray-2/50 dark:hover:bg-dark-2/50",
                          isSelected && "bg-primary/5 dark:bg-primary/10"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {isSelected ? (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : (
                              <Circle className="h-5 w-5 text-dark-5 dark:text-dark-6" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-dark dark:text-white">
                                {perm.displayName || perm.code}
                              </span>
                              <code className="rounded bg-gray-2 px-1.5 py-0.5 text-[10px] font-mono text-dark-5 dark:bg-dark-3 dark:text-dark-6">
                                {perm.code}
                              </code>

                              {perm.isDangerous && (
                                <span className="flex items-center gap-1 rounded bg-red/10 px-1.5 py-0.5 text-[10px] font-bold text-red dark:bg-red/20">
                                  <ShieldAlert className="h-3 w-3" />
                                  Elevated / Dangerous
                                </span>
                              )}
                            </div>

                            {perm.description && (
                              <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                                {perm.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
