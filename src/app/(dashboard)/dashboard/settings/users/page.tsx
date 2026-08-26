import React from "react";
import { UsersScreen } from "@/screens/users/users-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Roster & Roles | Cloud ERP",
  description: "Manage company users and security role assignments.",
};

export default function UserManagementPage() {
  return <UsersScreen />;
}
