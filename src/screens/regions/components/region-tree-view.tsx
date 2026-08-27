"use client";

import React, { useState } from "react";
import { RegionTreeNode } from "@/lib/api/types";
import { ChevronRight, ChevronDown, Folder, FolderOpen, Edit2, CheckCircle2, XCircle } from "lucide-react";

interface RegionTreeViewProps {
  nodes: RegionTreeNode[];
  onEditRegion: (nodeId: string) => void;
}

interface TreeNodeItemProps {
  node: RegionTreeNode;
  depth: number;
  onEditRegion: (nodeId: string) => void;
}

function TreeNodeItem({ node, depth, onEditRegion }: TreeNodeItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-gray-2/70 dark:hover:bg-dark-2/70 transition group"
        style={{ paddingLeft: `${Math.max(12, depth * 24)}px` }}
      >
        <div className="flex items-center gap-2">
          {hasChildren ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-3 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white transition"
            >
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <span className="w-6" />
          )}

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {hasChildren && isOpen ? (
              <FolderOpen className="h-3.5 w-3.5" />
            ) : (
              <Folder className="h-3.5 w-3.5" />
            )}
          </div>

          <span className="text-xs font-bold text-dark dark:text-white">{node.name}</span>

          <span className="font-mono text-[10px] font-semibold text-dark-5 dark:text-dark-6 bg-gray-2 dark:bg-dark-2 px-2 py-0.5 rounded border border-stroke dark:border-dark-3">
            {node.code}
          </span>

          {node.isActive ? (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-green">
              <CheckCircle2 className="h-3 w-3" /> Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-red-500">
              <XCircle className="h-3 w-3" /> Inactive
            </span>
          )}
        </div>

        <button
          onClick={() => onEditRegion(node.id)}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline transition"
        >
          <Edit2 className="h-3 w-3" /> Edit
        </button>
      </div>

      {hasChildren && isOpen && (
        <div className="border-l border-stroke/60 dark:border-dark-3/60 ml-6 my-1">
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onEditRegion={onEditRegion}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function RegionTreeView({ nodes, onEditRegion }: RegionTreeViewProps) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-dark-5 dark:text-dark-6">
        No regions present in tree. Create top-level regions to build your hierarchy.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-1">
      {nodes.map((node) => (
        <TreeNodeItem key={node.id} node={node} depth={0} onEditRegion={onEditRegion} />
      ))}
    </div>
  );
}
