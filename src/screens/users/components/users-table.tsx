"use client";

import React from "react";
import { CompanyUserDto, RoleDto } from "@/lib/api/types";
import { Shield, UserCheck } from "lucide-react";

interface UsersTableProps {
  users: CompanyUserDto[];
  roles: RoleDto[];
  loading: boolean;
  searchTerm: string;
  onOpenAssignModal: (user: CompanyUserDto) => void;
  onRemoveRole: (userId: string, roleId: string) => Promise<void>;
}

export function UsersTable({
  users,
  roles,
  loading,
  searchTerm,
  onOpenAssignModal,
  onRemoveRole,
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
            <thead className="bg-gray-2 text-dark-5 dark:bg-dark-2 dark:text-dark-6 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Assigned Roles</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-dark-3">
              {filteredUsers.map((user) => {
                const userRolesList = getUserRoles(user);

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-2/50 dark:hover:bg-dark-2/50 transition-colors"
                  >
                    {/* Email & Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-dark dark:text-white text-sm">
                              {user.email}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-[10px] font-bold text-green">
                              <UserCheck className="h-3 w-3" /> Active
                            </span>
                          </div>
                          <span className="text-[11px] text-dark-5 dark:text-dark-6">
                            ID: {user.id}
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
                                className="ml-1 hover:text-red transition"
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

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onOpenAssignModal(user)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gray-2 px-3.5 py-2 text-xs font-bold text-dark hover:bg-primary hover:text-white dark:bg-dark-2 dark:text-white dark:hover:bg-primary transition"
                      >
                        <Shield className="h-3.5 w-3.5" />
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

          return (
            <div
              key={user.id}
              className="rounded-2xl border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-dark dark:text-white truncate max-w-[180px]">
                      {user.email}
                    </h4>
                    <span className="text-[10px] text-dark-5">Active Member</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenAssignModal(user)}
                  className="rounded-lg bg-primary/10 p-2 text-primary font-bold text-xs hover:bg-primary hover:text-white transition"
                >
                  Manage Roles
                </button>
              </div>

              <div className="pt-2 border-t border-stroke dark:border-dark-3">
                <span className="text-[11px] font-semibold text-dark-5 block mb-1.5">
                  Assigned Roles:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {userRolesList.length > 0 ? (
                    userRolesList.map((r) => (
                      <span
                        key={r.id}
                        className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
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
