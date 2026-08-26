"use client";

import React, { useState } from "react";
import { CompanyUserDto, RoleDto } from "@/lib/api/types";
import { X, Shield } from "lucide-react";

interface AssignRoleModalProps {
  isOpen: boolean;
  user: CompanyUserDto | null;
  roles: RoleDto[];
  onClose: () => void;
  onSubmit: (roleId: string) => Promise<void>;
  isSubmitting: boolean;
}

export function AssignRoleModal({
  isOpen,
  user,
  roles,
  onClose,
  onSubmit,
  isSubmitting,
}: AssignRoleModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState("");

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) return;
    await onSubmit(selectedRoleId);
    setSelectedRoleId("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2 dark:bg-gray-dark border border-stroke dark:border-dark-3 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-dark dark:text-white">
            Assign Role to User
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-dark-5 hover:bg-gray-2 dark:hover:bg-dark-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-dark-5 mb-4">
          Select a security role to assign to <strong className="text-dark dark:text-white">{user.email}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-dark dark:text-white">
              Select Role *
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
              <select
                required
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-3 pl-9 pr-3 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              >
                <option value="">Choose role...</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} {r.isTemplate ? "(Template)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stroke dark:border-dark-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stroke px-4 py-2 text-xs font-semibold text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedRoleId}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Assigning..." : "Assign Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
