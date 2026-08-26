"use client";

import React, { useState, useEffect } from "react";
import { rolesApi } from "@/lib/api/roles/roles";
import { RoleDto, RoleUsageDto, AuditHistoryItem } from "@/lib/api/types";
import { X, Users, History, UserCheck, Clock, Shield } from "lucide-react";
import { clsx } from "clsx";

interface RoleAuditModalProps {
  companyId: string;
  role: RoleDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RoleAuditModal({
  companyId,
  role,
  isOpen,
  onClose,
}: RoleAuditModalProps) {
  const [activeTab, setActiveTab] = useState<"usage" | "audit">("usage");
  const [usage, setUsage] = useState<RoleUsageDto | null>(null);
  const [auditItems, setAuditItems] = useState<AuditHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && role && companyId) {
      setLoading(true);
      Promise.all([
        rolesApi.getRoleUsage(companyId, role.id).catch(() => null),
        rolesApi.getRoleAuditHistory(companyId, role.id).catch(() => null),
      ])
        .then(([usageRes, auditRes]) => {
          if (usageRes) setUsage(usageRes);
          if (auditRes && Array.isArray(auditRes.items)) {
            setAuditItems(auditRes.items);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, role, companyId]);

  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2 dark:bg-gray-dark border border-stroke dark:border-dark-3">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-dark dark:text-white">
                {role.name} - Usage & Audit History
              </h3>
              <p className="text-xs text-dark-5 dark:text-dark-6">
                {role.isSystem ? "System Role Template" : "Company Custom Role"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stroke px-6 dark:border-dark-3 bg-gray-2/50 dark:bg-dark-2/50">
          <button
            onClick={() => setActiveTab("usage")}
            className={clsx(
              "flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition",
              activeTab === "usage"
                ? "border-primary text-primary"
                : "border-transparent text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
            )}
          >
            <Users className="h-4 w-4" />
            Assigned Users ({usage?.count ?? role.assignedUserCount ?? 0})
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={clsx(
              "flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition",
              activeTab === "audit"
                ? "border-primary text-primary"
                : "border-transparent text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
            )}
          >
            <History className="h-4 w-4" />
            Audit Log History ({auditItems.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : activeTab === "usage" ? (
            <div>
              {usage && usage.users.length > 0 ? (
                <div className="divide-y divide-stroke dark:divide-dark-3 border border-stroke dark:border-dark-3 rounded-xl overflow-hidden">
                  {usage.users.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-4 bg-white dark:bg-gray-dark"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          <UserCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-dark dark:text-white">
                            {u.email}
                          </p>
                          <p className="text-[10px] text-dark-5 dark:text-dark-6">
                            ID: {u.id}
                          </p>
                        </div>
                      </div>
                      <span className="rounded bg-green/10 px-2 py-0.5 text-[10px] font-bold text-green dark:bg-green/20">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-dark-5 dark:text-dark-6">
                  No users are currently assigned to this role in this company.
                </div>
              )}
            </div>
          ) : (
            <div>
              {auditItems.length > 0 ? (
                <div className="space-y-4">
                  {auditItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-stroke p-4 dark:border-dark-3 bg-white dark:bg-gray-dark"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary dark:bg-primary/20">
                          {item.action}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-dark-5 dark:text-dark-6">
                          <Clock className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <p className="text-xs text-dark-5 dark:text-dark-6">
                        <strong className="text-dark dark:text-white">
                          Actor:
                        </strong>{" "}
                        {item.actorId}
                      </p>

                      {item.after && (
                        <pre className="mt-2 overflow-x-auto rounded bg-gray-2 p-2 text-[10px] font-mono text-dark dark:bg-dark-2 dark:text-white">
                          {JSON.stringify(item.after, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-dark-5 dark:text-dark-6">
                  No audit trail recorded yet for this role.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
