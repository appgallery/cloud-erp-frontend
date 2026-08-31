import React from "react";
import { Metadata } from "next";
import { DepartmentsScreen } from "@/screens/departments/departments-screen";

export const metadata: Metadata = {
  title: "Departments | Cloud ERP",
  description: "Manage branch department hierarchies and functional units",
};

export default function DepartmentsPage() {
  return <DepartmentsScreen />;
}
