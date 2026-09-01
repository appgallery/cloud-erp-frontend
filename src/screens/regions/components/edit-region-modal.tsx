"use client";

import React, { useState, useEffect } from "react";
import { RegionDto, UpdateRegionDto } from "@/lib/api/types";
import { X, Map, GitBranch, Lock } from "lucide-react";
import { CustomSelect } from "@/components/forms/select";

interface EditRegionModalProps {
  isOpen: boolean;
  region: RegionDto | null;
  regionsList: RegionDto[];
  onClose: () => void;
  onSubmit: (regionId: string, dto: UpdateRegionDto) => Promise<void>;
  isSubmitting: boolean;
}

export function EditRegionModal({
  isOpen,
  region,
  regionsList,
  onClose,
  onSubmit,
  isSubmitting,
}: EditRegionModalProps) {
  const [formData, setFormData] = useState<UpdateRegionDto>({});

  useEffect(() => {
    if (region) {
      setFormData({
        name: region.name || "",
        parentId: region.parentId || null,
        isActive: region.isActive,
      });
    }
  }, [region]);

  if (!isOpen || !region) return null;

  // Filter out self to prevent self-parenting
  const validParents = regionsList.filter((r) => r.id !== region.id);

  const parentOptions = [
    { value: "", label: "(None - Top Level Region)" },
    ...validParents.map((reg) => ({
      value: reg.id,
      label: `${reg.name} (${reg.code})`,
    })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(region.id, formData);
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
              <h3 className="text-lg font-bold text-dark dark:text-white">Edit Region Details</h3>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                Update region settings for <strong>{region.name}</strong> ({region.code}).
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Region Code (Immutable) */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-dark-5 dark:text-dark-6 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Region Code (Immutable)
            </label>
            <input
              type="text"
              disabled
              value={region.code}
              className="w-full rounded-xl border border-stroke bg-gray-3 py-2.5 px-3.5 text-xs text-dark-5 font-mono uppercase cursor-not-allowed dark:border-dark-3 dark:bg-dark-3 dark:text-dark-6"
            />
          </div>

          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
              Region Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
            />
          </div>

          {/* Parent Region */}
          <div>
            <CustomSelect
              label="Parent Region Hierarchy"
              placeholder="Select parent region..."
              value={formData.parentId || ""}
              onChange={(val) =>
                setFormData({ ...formData, parentId: val || null })
              }
              options={parentOptions}
              icon={<GitBranch className="h-3.5 w-3.5 text-primary" />}
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-stroke bg-gray-2 p-3 dark:border-dark-3 dark:bg-dark-2">
            <div>
              <span className="block text-xs font-bold text-dark dark:text-white">
                Region Active Status
              </span>
              <span className="text-[11px] text-dark-5 dark:text-dark-6">
                Active regions can be assigned to operational branches.
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.isActive ?? true}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-5 w-5 rounded border-stroke text-primary focus:ring-primary accent-primary cursor-pointer"
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
