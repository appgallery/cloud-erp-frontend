"use client";

import React, { useState } from "react";
import { CompanyUserDto, RoleDto } from "@/lib/api/types";
import { X, Shield } from "lucide-react";
import { CustomSelect } from "@/components/forms/select";

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

  const roleOptions = roles.map((r) => ({
    value: r.id,
    label: r.name,
    badge: r.isTemplate ? "Template" : undefined,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) return;
    await onSubmit(selectedRoleId);
    setSelectedRoleId("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2 dark:bg-gray-dark border border-stroke dark:border-dark-3 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-stroke dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark dark:text-white">
                Assign Role to User
              </h3>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                Change permission profile for <strong className="text-dark dark:text-white">{user.email}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 dark:hover:bg-dark-3 dark:text-dark-6 dark:hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <CustomSelect
              label="Select Security Role"
              required
              placeholder="Choose a role..."
              value={selectedRoleId}
              onChange={(val) => setSelectedRoleId(val)}
              options={roleOptions}
              icon={<Shield className="h-4 w-4" />}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stroke dark:border-dark-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stroke bg-white px-4 py-2.5 text-xs font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedRoleId}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 disabled:opacity-50 transition cursor-pointer"
            >
              {isSubmitting ? "Assigning..." : "Assign Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
