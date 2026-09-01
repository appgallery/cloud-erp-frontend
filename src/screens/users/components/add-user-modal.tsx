"use client";

import React, { useState } from "react";
import { CreateCompanyUserDto, RoleDto } from "@/lib/api/types";
import { X, Mail, Shield, UserPlus, Info } from "lucide-react";
import { CustomSelect } from "@/components/forms/select";

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
    roleId: "",
  });

  if (!isOpen) return null;

  const roleOptions = [
    { value: "", label: "No initial role (assign later)" },
    ...roles.map((r) => ({
      value: r.id,
      label: r.name,
      badge: r.isTemplate ? "Template" : undefined,
    })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) return;
    await onSubmit({
      email: form.email.trim(),
      roleId: form.roleId || undefined,
    });
    setForm({ email: "", roleId: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2 dark:bg-gray-dark border border-stroke dark:border-dark-3 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-stroke dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark dark:text-white">
                Invite Company User
              </h3>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                Add a new user to your organization and grant permissions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:text-dark-6 dark:hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
              <input
                type="email"
                required
                placeholder="colleague@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 pl-10 pr-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
              />
            </div>
          </div>

          <div>
            <CustomSelect
              label="Role Assignment (Optional)"
              placeholder="Choose a role..."
              value={form.roleId || ""}
              onChange={(val) => setForm({ ...form, roleId: val })}
              options={roleOptions}
              icon={<Shield className="h-4 w-4" />}
            />
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-blue-50/70 p-3 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
            <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <p className="text-xs text-dark-5 dark:text-dark-6">
              An invitation email with a secure link will be sent to the user to activate their account and set their own password.
            </p>
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
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 disabled:opacity-50 transition cursor-pointer"
            >
              {isSubmitting ? "Inviting..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
