import React from "react";
import { BranchesScreen } from "@/screens/branches/branches-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branch Management | Cloud ERP",
  description: "Manage head office locations, sales branches, warehouses, and activation status.",
};

export default function BranchesPage() {
  return <BranchesScreen />;
}
