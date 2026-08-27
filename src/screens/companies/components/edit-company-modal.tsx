"use client";

import React, { useState, useEffect } from "react";
import { CompanyDto, UpdateCompanyDto } from "@/lib/api/types";
import { X, Building2, Globe, MapPin, DollarSign, Lock } from "lucide-react";

interface EditCompanyModalProps {
  isOpen: boolean;
  company: CompanyDto | null;
  onClose: () => void;
  onSubmit: (companyId: string, dto: UpdateCompanyDto) => Promise<void>;
  isSubmitting: boolean;
}

export function EditCompanyModal({
  isOpen,
  company,
  onClose,
  onSubmit,
  isSubmitting,
}: EditCompanyModalProps) {
  const [formData, setFormData] = useState<UpdateCompanyDto>({});

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        baseCurrency: company.baseCurrency || "USD",
        addressLine1: company.addressLine1 || "",
        addressLine2: company.addressLine2 || "",
        city: company.city || "",
        state: company.state || "",
        country: company.country || "IN",
        postalCode: company.postalCode || "",
        taxId: company.taxId || "",
        timezone: company.timezone || "Asia/Kolkata",
      });
    }
  }, [company]);

  if (!isOpen || !company) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(company.id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-stroke bg-white p-6 shadow-2 dark:border-dark-3 dark:bg-gray-dark my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stroke dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark dark:text-white">Edit Company Details</h3>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                Update operational details for company <strong>{company.name}</strong> ({company.code}).
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
            {/* Company Code (Immutable) */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-dark-5 dark:text-dark-6 flex items-center gap-1">
                <Lock className="h-3 w-3" /> Company Code (Immutable)
              </label>
              <input
                type="text"
                disabled
                value={company.code}
                className="w-full rounded-xl border border-stroke bg-gray-3 py-2.5 px-3.5 text-xs text-dark-5 font-mono uppercase cursor-not-allowed dark:border-dark-3 dark:bg-dark-3 dark:text-dark-6"
              />
            </div>

            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            {/* Base Currency */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                Base Currency
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={3}
                  value={formData.baseCurrency || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, baseCurrency: e.target.value.toUpperCase() })
                  }
                  className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark font-mono uppercase focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
                <DollarSign className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
              </div>
            </div>

            {/* Tax ID */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
                Tax ID / GSTIN / EIN
              </label>
              <input
                type="text"
                value={formData.taxId || ""}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>

          {/* Address Fields */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-dark dark:text-white flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Address Details
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

          {/* Timezone */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
              Timezone
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.timezone || ""}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 px-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
              <Globe className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5" />
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
