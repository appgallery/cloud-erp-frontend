"use client";

import React, { useState } from "react";
import { CreateRegionDto, RegionDto } from "@/lib/api/types";
import { X, Map, Hash, GitBranch } from "lucide-react";

interface CreateRegionModalProps {
  isOpen: boolean;
  regionsList: RegionDto[];
  onClose: () => void;
  onSubmit: (dto: CreateRegionDto) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateRegionModal({
  isOpen,
  regionsList,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateRegionModalProps) {
  const [formData, setFormData] = useState<CreateRegionDto>({
    name: "",
    code: "",
    parentId: undefined,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;
    await onSubmit({
      ...formData,
      code: formData.code.trim().toUpperCase(),
      parentId: formData.parentId || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-stroke bg-white p-6 shadow-2 dark:border-dark-3 dark:bg-gray-dark my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stroke dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark dark:text-white">Create New Region</h3>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                Add a geographical operating zone or territory.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
              Region Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. North America, West Coast, South Zone"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          {/* Code */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
              Region Code <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. NORTH_ZONE"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark font-mono uppercase focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
              <Hash className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
            </div>
            <p className="mt-1 text-[10px] text-dark-5 dark:text-dark-6">
              2-20 characters (Uppercase letters, digits, hyphens, underscores).
            </p>
          </div>

          {/* Parent Region */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white flex items-center gap-1">
              <GitBranch className="h-3.5 w-3.5 text-primary" /> Parent Region (Optional Hierarchy)
            </label>
            <select
              value={formData.parentId || ""}
              onChange={(e) =>
                setFormData({ ...formData, parentId: e.target.value || undefined })
              }
              className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="">(None - Top Level Region)</option>
              {regionsList.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name} ({reg.code})
                </option>
              ))}
            </select>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stroke dark:border-dark-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stroke bg-white px-4 py-2.5 text-xs font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {isSubmitting ? "Creating..." : "Create Region"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
