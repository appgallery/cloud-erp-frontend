"use client";

import React, { useState, useEffect } from "react";
import { RoleDto } from "@/lib/api/types";
import { X } from "lucide-react";

interface CloneRoleModalProps {
  isOpen: boolean;
  role: RoleDto | null;
  onClose: () => void;
  onSubmit: (form: { name: string; description: string }) => Promise<void>;
  isSubmitting: boolean;
}

export function CloneRoleModal({
  isOpen,
  role,
  onClose,
  onSubmit,
  isSubmitting,
}: CloneRoleModalProps) {
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (role) {
      setForm({
        name: `${role.name} (Copy)`,
        description: `Cloned from ${role.name}`,
      });
    }
  }, [role]);

  if (!isOpen || !role) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2 dark:bg-gray-dark border border-stroke dark:border-dark-3 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-dark dark:text-white">
            Clone Role: {role.name}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-dark-5 hover:bg-gray-2 dark:hover:bg-dark-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-dark-5 mb-4">
          Cloning copies all permission capabilities from &quot;{role.name}&quot; into a new custom editable role.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-dark dark:text-white">
              New Role Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-stroke bg-gray-2 p-3 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-dark dark:text-white">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-stroke bg-gray-2 p-3 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
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
              disabled={isSubmitting}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Cloning..." : "Confirm & Clone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
