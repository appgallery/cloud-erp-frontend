import React from "react";
import { RolesScreen } from "@/screens/roles/roles-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles & Permissions | Cloud ERP",
  description: "Manage company roles and security permissions matrix.",
};

export default function RolesManagementPage() {
  return <RolesScreen />;
}
