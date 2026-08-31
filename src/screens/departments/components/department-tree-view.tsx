"use client";

import React, { useState } from "react";
import { DepartmentTreeNode, CompanyUserDto } from "@/lib/api/types";
import {
  ChevronRight,
  ChevronDown,
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  User,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface DepartmentTreeViewProps {
  tree: DepartmentTreeNode[];
  users: CompanyUserDto[];
  onAddChild: (parentId: string) => void;
  onEdit: (departmentId: string) => void;
  onDelete: (departmentId: string, departmentName: string) => void;
}

interface TreeNodeItemProps {
  node: DepartmentTreeNode;
  usersMap: Map<string, string>;
  depth?: number;
  onAddChild: (parentId: string) => void;
  onEdit: (departmentId: string) => void;
  onDelete: (departmentId: string, departmentName: string) => void;
}

function TreeNodeItem({
  node,
  usersMap,
  depth = 0,
  onAddChild,
  onEdit,
  onDelete,
}: TreeNodeItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const headEmail = node.headUserId ? usersMap.get(node.headUserId) : null;

  return (
    <div className="relative">
      <div
        className={`group flex items-center justify-between rounded-xl border border-stroke bg-white p-3.5 shadow-xs transition hover:border-primary/50 dark:border-dark-3 dark:bg-gray-dark mb-2`}
        style={{ marginLeft: `${depth * 24}px` }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Expand / Collapse Button */}
          {hasChildren ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white transition cursor-pointer"
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center text-dark-5/40">
              <span className="h-1.5 w-1.5 rounded-full bg-dark-5/40" />
            </div>
          )}

          {/* Department Icon & Name */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderTree className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs text-dark dark:text-white truncate">
                {node.name}
              </span>
              <span className="font-mono text-[10px] font-semibold text-dark-5 dark:text-dark-6 bg-gray-2 dark:bg-dark-2 px-2 py-0.5 rounded border border-stroke dark:border-dark-3">
                {node.code}
              </span>
              {node.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green dark:bg-green-950/40">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <XCircle className="h-2.5 w-2.5" /> Inactive
                </span>
              )}
            </div>

            {/* Department Head & Child summary */}
            <div className="mt-1 flex items-center gap-3 text-[11px] text-dark-5 dark:text-dark-6 flex-wrap">
              {headEmail ? (
                <span className="inline-flex items-center gap-1 text-dark dark:text-white font-medium">
                  <User className="h-3 w-3 text-primary" /> Head: {headEmail}
                </span>
              ) : (
                <span className="italic text-dark-5">No head assigned</span>
              )}

              {hasChildren && (
                <span className="rounded-md bg-purple-50 px-2 py-0.2 text-[10px] font-semibold text-primary dark:bg-purple-950/40">
                  {node.children.length} sub-department{node.children.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {depth < 4 && (
            <button
              onClick={() => onAddChild(node.id)}
              title="Add Sub-Department"
              className="flex h-8 items-center gap-1 rounded-lg border border-stroke bg-white px-2 text-[11px] font-semibold text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 transition cursor-pointer shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">Add Sub</span>
            </button>
          )}

          <button
            onClick={() => onEdit(node.id)}
            title="Edit Department"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 transition cursor-pointer shadow-xs"
          >
            <Edit2 className="h-3.5 w-3.5 text-primary" />
          </button>

          <button
            onClick={() => onDelete(node.id, node.name)}
            title="Delete Department"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-white text-dark-5 hover:bg-red-50 hover:text-red-600 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition cursor-pointer shadow-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Recursive Children */}
      {hasChildren && isOpen && (
        <div className="relative">
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              usersMap={usersMap}
              depth={depth + 1}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DepartmentTreeView({
  tree,
  users,
  onAddChild,
  onEdit,
  onDelete,
}: DepartmentTreeViewProps) {
  const usersMap = new Map(users.map((u) => [u.id, u.email]));

  if (tree.length === 0) {
    return (
      <div className="rounded-2xl border border-stroke bg-white p-12 text-center text-xs text-dark-5 dark:border-dark-3 dark:bg-gray-dark">
        <FolderTree className="mx-auto h-8 w-8 text-dark-5 mb-2 opacity-50" />
        No department hierarchy defined for this branch yet. Create your first top-level department above.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tree.map((rootNode) => (
        <TreeNodeItem
          key={rootNode.id}
          node={rootNode}
          usersMap={usersMap}
          depth={0}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
