"use client";

import React, { useState, useEffect } from "react";
import { DepartmentDto, UpdateDepartmentDto, CompanyUserDto } from "@/lib/api/types";
import { X, FolderTree, User, Edit2 } from "lucide-react";
import { CustomSelect } from "@/components/forms/select";

interface EditDepartmentModalProps {
  isOpen: boolean;
  branchName: string;
  department: DepartmentDto | null;
  departments: DepartmentDto[];
  users: CompanyUserDto[];
  onClose: () => void;
  onSubmit: (departmentId: string, dto: UpdateDepartmentDto) => Promise<void>;
  isSubmitting: boolean;
}

export function EditDepartmentModal({
  isOpen,
  branchName,
  department,
  departments,
  users,
  onClose,
  onSubmit,
  isSubmitting,
}: EditDepartmentModalProps) {
  const [formData, setFormData] = useState<UpdateDepartmentDto>({
    name: "",
    parentId: null,
    headUserId: null,
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (department && isOpen) {
      setFormData({
        name: department.name,
        parentId: department.parentId ?? null,
        headUserId: department.headUserId ?? null,
        description: department.description ?? "",
        isActive: department.isActive,
      });
    }
  }, [department, isOpen]);

  if (!isOpen || !department) return null;

  // Prevent selecting self as parent
  const availableParents = departments.filter(
    (d) => d.id !== department.id && !d.deletedAt
  );

  const parentOptions = [
    { value: "", label: "Top-Level (Root Department)" },
    ...availableParents.map((d) => ({
      value: d.id,
      label: `${d.name} (${d.code})`,
    })),
  ];

  const headOptions = [
    { value: "", label: "Unassigned (No head)" },
    ...users
      .filter((u) => u.isActive)
      .map((u) => ({
        value: u.id,
        label: u.email,
      })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    await onSubmit(department.id, {
      name: formData.name.trim(),
      parentId: formData.parentId || null,
      headUserId: formData.headUserId || null,
      description: formData.description?.trim() || undefined,
      isActive: formData.isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-stroke bg-white p-6 shadow-2 dark:border-dark-3 dark:bg-gray-dark my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stroke dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Edit2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark dark:text-white">
                Edit Department: {department.name}
              </h3>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                Code: <span className="font-mono font-bold text-dark dark:text-white">{department.code}</span> • Branch: {branchName}
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
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Parent Department */}
            <div>
              <CustomSelect
                label="Parent Department"
                value={formData.parentId || ""}
                onChange={(val) =>
                  setFormData({ ...formData, parentId: val || null })
                }
                options={parentOptions}
                icon={<FolderTree className="h-3.5 w-3.5 text-primary" />}
              />
            </div>

            {/* Department Head */}
            <div>
              <CustomSelect
                label="Department Head (Lead)"
                value={formData.headUserId || ""}
                onChange={(val) =>
                  setFormData({ ...formData, headUserId: val || null })
                }
                options={headOptions}
                icon={<User className="h-3.5 w-3.5 text-primary" />}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
              Description
            </label>
            <textarea
              rows={3}
              maxLength={500}
              placeholder="Department description..."
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition resize-none"
            />
          </div>

          {/* Active Toggle Switch */}
          <div className="flex items-center justify-between rounded-xl bg-gray-2/60 p-3.5 dark:bg-dark-2/60 border border-stroke dark:border-dark-3">
            <div>
              <span className="text-xs font-bold text-dark dark:text-white block">
                Department Operational Status
              </span>
              <span className="text-[11px] text-dark-5 dark:text-dark-6">
                Active departments are visible for operational assignments and workflows.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive ?? true}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-3 peer-focus:outline-none rounded-full peer dark:bg-dark-3 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
