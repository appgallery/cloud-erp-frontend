"use client";

import React, { useState, useEffect } from "react";
import { BranchDto, UpdateBranchDto, BranchType, RegionDto } from "@/lib/api/types";
import { X, Building, MapPin, Phone, Mail, Map, Lock } from "lucide-react";

interface EditBranchModalProps {
  isOpen: boolean;
  branch: BranchDto | null;
  regionsList: RegionDto[];
  onClose: () => void;
  onSubmit: (branchId: string, dto: UpdateBranchDto) => Promise<void>;
  isSubmitting: boolean;
}

const BRANCH_TYPES: { label: string; value: BranchType }[] = [
  { label: "Head Office", value: "HEAD_OFFICE" },
  { label: "Sales Office", value: "SALES" },
  { label: "Warehouse", value: "WAREHOUSE" },
  { label: "Service Center", value: "SERVICE_CENTER" },
  { label: "Factory", value: "FACTORY" },
];

export function EditBranchModal({
  isOpen,
  branch,
  regionsList,
  onClose,
  onSubmit,
  isSubmitting,
}: EditBranchModalProps) {
  const [formData, setFormData] = useState<UpdateBranchDto>({});

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || "",
        type: branch.type || "SALES",
        regionId: branch.regionId || null,
        addressLine1: branch.addressLine1 || "",
        addressLine2: branch.addressLine2 || "",
        city: branch.city || "",
        state: branch.state || "",
        country: branch.country || "IN",
        postalCode: branch.postalCode || "",
        phone: branch.phone || "",
        email: branch.email || "",
      });
    }
  }, [branch]);

  if (!isOpen || !branch) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(branch.id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-stroke bg-white p-6 shadow-2 dark:border-dark-3 dark:bg-gray-dark my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stroke dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark dark:text-white">Edit Branch Details</h3>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                Update operational details for branch <strong>{branch.name}</strong> ({branch.code}).
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Code (Immutable) */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-dark-5 dark:text-dark-6 flex items-center gap-1">
                <Lock className="h-3 w-3" /> Branch Code (Immutable)
              </label>
              <input
                type="text"
                disabled
                value={branch.code}
                className="w-full rounded-xl border border-stroke bg-gray-3 py-2.5 px-3.5 text-xs text-dark-5 font-mono uppercase cursor-not-allowed dark:border-dark-3 dark:bg-dark-3 dark:text-dark-6"
              />
            </div>

            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                Branch Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            {/* Branch Type */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                Branch Type
              </label>
              <select
                value={formData.type || "SALES"}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as BranchType })
                }
                className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              >
                {BRANCH_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Selection */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white flex items-center gap-1">
                <Map className="h-3.5 w-3.5 text-primary" /> Region Association
              </label>
              <select
                value={formData.regionId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, regionId: e.target.value || null })
                }
                className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              >
                <option value="">(Unassigned)</option>
                {regionsList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Fields */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-dark dark:text-white flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Location & Address Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={formData.addressLine1 || ""}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Address Line 2"
                  value={formData.addressLine2 || ""}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="State / Province"
                  value={formData.state || ""}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="Country Code (e.g. IN, US)"
                  value={formData.country || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value.toUpperCase() })
                  }
                  className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark uppercase focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Postal / ZIP Code"
                  value={formData.postalCode || ""}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                Contact Phone
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
                <Phone className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                Contact Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
                <Mail className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
              </div>
            </div>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
