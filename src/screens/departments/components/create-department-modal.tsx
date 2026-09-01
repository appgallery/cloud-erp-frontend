"use client";

import React, { useState, useEffect } from "react";
import { CreateDepartmentDto, DepartmentDto, CompanyUserDto } from "@/lib/api/types";
import { X, Hash, User, FolderTree } from "lucide-react";
import { CustomSelect } from "@/components/forms/select";

interface CreateDepartmentModalProps {
  isOpen: boolean;
  branchName: string;
  departments: DepartmentDto[];
  users: CompanyUserDto[];
  defaultParentId?: string;
  onClose: () => void;
  onSubmit: (dto: CreateDepartmentDto) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateDepartmentModal({
  isOpen,
  branchName,
  departments,
  users,
  defaultParentId,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateDepartmentModalProps) {
  const [formData, setFormData] = useState<CreateDepartmentDto>({
    name: "",
    code: "",
    parentId: defaultParentId || "",
    headUserId: "",
    description: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        code: "",
        parentId: defaultParentId || "",
        headUserId: "",
        description: "",
      });
    }
  }, [isOpen, defaultParentId]);

  if (!isOpen) return null;

  const parentOptions = [
    { value: "", label: "Top-Level (Root Department)" },
    ...departments
      .filter((d) => !d.deletedAt)
      .map((d) => ({
        value: d.id,
        label: `${d.name} (${d.code})`,
      })),
  ];

  const headOptions = [
    { value: "", label: "Unassigned (No head designated)" },
    ...users
      .filter((u) => u.isActive)
      .map((u) => ({
        value: u.id,
        label: u.email,
      })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    await onSubmit({
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      parentId: formData.parentId || undefined,
      headUserId: formData.headUserId || undefined,
      description: formData.description?.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-stroke bg-white p-6 shadow-2 dark:border-dark-3 dark:bg-gray-dark my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stroke dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderTree className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark dark:text-white">
                Create Department
              </h3>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                Branch: <span className="font-semibold text-dark dark:text-white">{branchName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Engineering"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
              />
            </div>

            {/* Department Code */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                Department Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. ENG-CORE"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark font-mono uppercase focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
                />
                <Hash className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
              </div>
              <p className="mt-1 text-[10px] text-dark-5 dark:text-dark-6">
                2-20 chars (letters, digits, underscores, hyphens).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Parent Department */}
            <div>
              <CustomSelect
                label="Parent Department (Hierarchy)"
                value={formData.parentId || ""}
                onChange={(val) => setFormData({ ...formData, parentId: val })}
                options={parentOptions}
                icon={<FolderTree className="h-3.5 w-3.5 text-primary" />}
              />
            </div>

            {/* Head of Department */}
            <div>
              <CustomSelect
                label="Department Head (Lead)"
                value={formData.headUserId || ""}
                onChange={(val) => setFormData({ ...formData, headUserId: val })}
                options={headOptions}
                icon={<User className="h-3.5 w-3.5 text-primary" />}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
              Description & Objectives (Optional)
            </label>
            <textarea
              rows={3}
              maxLength={500}
              placeholder="Responsibilities, scope, and functional goals of this department..."
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stroke dark:border-dark-3">
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
              {isSubmitting ? "Creating..." : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
