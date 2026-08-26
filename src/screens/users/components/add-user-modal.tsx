"use client";

import React, { useState } from "react";
import { CreateCompanyUserDto, RoleDto } from "@/lib/api/types";
import { X, Mail, Lock, Shield } from "lucide-react";

interface AddUserModalProps {
  isOpen: boolean;
  roles: RoleDto[];
  onClose: () => void;
  onSubmit: (form: CreateCompanyUserDto) => Promise<void>;
  isSubmitting: boolean;
}

export function AddUserModal({
  isOpen,
  roles,
  onClose,
  onSubmit,
  isSubmitting,
}: AddUserModalProps) {
  const [form, setForm] = useState<CreateCompanyUserDto>({
    email: "",
    password: "",
    roleId: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    setForm({ email: "", password: "", roleId: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2 dark:bg-gray-dark border border-stroke dark:border-dark-3 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-dark dark:text-white">
            Add Company User
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-dark-5 hover:bg-gray-2 dark:hover:bg-dark-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-dark dark:text-white">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
              <input
                type="email"
                required
                placeholder="user@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-3 pl-9 pr-3 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-dark dark:text-white">
              Temporary Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Initial password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-3 pl-9 pr-3 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-dark dark:text-white">
              Initial Role Assignment (Optional)
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
              <select
                value={form.roleId || ""}
                onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-3 pl-9 pr-3 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              >
                <option value="">No role initially</option>
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
              disabled={isSubmitting}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
