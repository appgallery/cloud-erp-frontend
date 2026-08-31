"use client";

import React from "react";
import { CompanyUserDto } from "@/lib/api/types";
import { Shield, CheckCircle2, XCircle } from "lucide-react";

interface UsersTableProps {
  users: CompanyUserDto[];
  loading: boolean;
  searchTerm: string;
  onOpenAssignModal: (user: CompanyUserDto) => void;
  onRemoveRole: (userId: string, roleId: string) => Promise<void>;
  onToggleActive: (user: CompanyUserDto) => Promise<void>;
  togglingId?: string | null;
}

export function UsersTable({
  users,
  loading,
  searchTerm,
  onOpenAssignModal,
  onRemoveRole,
  onToggleActive,
  togglingId,
}: UsersTableProps) {
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserRoles = (user: CompanyUserDto): Array<{ id: string; name: string }> => {
    if (user.roles && user.roles.length > 0) {
      return user.roles;
    }
    if (user.roleId && user.roleName) {
      return [{ id: user.roleId, name: user.roleName }];
    }
    return [];
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-stroke bg-white p-12 text-center text-xs text-dark-5 dark:border-dark-3 dark:bg-gray-dark">
        Loading company user roster...
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="rounded-2xl border border-stroke bg-white p-12 text-center text-xs text-dark-5 dark:border-dark-3 dark:bg-gray-dark">
        No user records found matching search query.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View (md and above) */}
      <div className="hidden md:block overflow-hidden bg-white dark:bg-gray-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-2/60 text-dark-5 dark:bg-dark-2/60 dark:text-dark-6 uppercase font-bold text-[10px] tracking-wider border-b border-stroke dark:border-dark-3">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Assigned Roles</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-dark-3">
              {filteredUsers.map((user) => {
                const userRolesList = getUserRoles(user);
                const isToggling = togglingId === user.id;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-2/50 dark:hover:bg-dark-2/50 transition-colors"
                  >
                    {/* Email & Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-dark dark:text-white text-xs">
                              {user.email}
                            </span>
                          </div>
                          <span className="text-[10px] text-dark-5 dark:text-dark-6 font-mono">
                            ID: {user.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Security Roles */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {userRolesList.length > 0 ? (
                          userRolesList.map((r) => (
                            <span
                              key={r.id}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary dark:bg-primary/20"
                            >
                              <Shield className="h-3 w-3" />
                              {r.name}
                              <button
                                title="Remove role"
                                onClick={() => onRemoveRole(user.id, r.id)}
                                className="ml-1 text-dark-5 hover:text-red transition cursor-pointer"
                              >
                                &times;
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs italic text-dark-5">
                            No roles assigned
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onToggleActive(user)}
                        disabled={isToggling}
                        title={user.isActive ? "Click to deactivate user" : "Click to activate user"}
                        className="inline-flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                      >
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-semibold text-green dark:bg-green-950/40 hover:bg-green-100 dark:hover:bg-green-900/50 transition">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                            <XCircle className="h-3 w-3" /> Inactive
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onOpenAssignModal(user)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-stroke bg-white px-3.5 py-1.5 text-xs font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 transition shadow-xs cursor-pointer"
                      >
                        <Shield className="h-3.5 w-3.5 text-primary" />
                        Manage Roles
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (sm and below) */}
      <div className="space-y-3 md:hidden">
        {filteredUsers.map((user) => {
          const userRolesList = getUserRoles(user);
          const isToggling = togglingId === user.id;

          return (
            <div
              key={user.id}
              className="rounded-2xl border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-dark dark:text-white truncate max-w-[180px]">
                      {user.email}
                    </h4>
                    <button
                      onClick={() => onToggleActive(user)}
                      disabled={isToggling}
                      className="text-[10px] mt-0.5 text-left font-semibold"
                    >
                      {user.isActive ? (
                        <span className="text-green flex items-center gap-1">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Active Member
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <XCircle className="h-2.5 w-2.5" /> Inactive Member
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onOpenAssignModal(user)}
                  className="rounded-xl border border-stroke bg-white px-3 py-1.5 text-xs font-semibold text-primary dark:border-dark-3 dark:bg-dark-2 hover:bg-gray-2 transition shadow-xs"
                >
                  Roles
                </button>
              </div>

              <div className="pt-2 border-t border-stroke dark:border-dark-3">
                <span className="text-[11px] font-semibold text-dark-5 dark:text-dark-6 block mb-1.5">
                  Assigned Roles:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {userRolesList.length > 0 ? (
                    userRolesList.map((r) => (
                      <span
                        key={r.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
                      >
                        {r.name}
                        <button
                          onClick={() => onRemoveRole(user.id, r.id)}
                          className="ml-1 text-red"
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs italic text-dark-5">No roles assigned</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
