import React from "react";
import { CrmScreen } from "@/screens/crm/crm-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM Dashboard | Cloud ERP",
  description: "Customer Relationship Management Dashboard",
};

export default function CrmPage() {
  return <CrmScreen />;
}