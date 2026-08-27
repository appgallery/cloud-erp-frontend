import React from "react";
import { CompaniesScreen } from "@/screens/companies/companies-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Companies Management | Cloud ERP",
  description: "Manage organizational company entities, base currencies, and tax settings.",
};

export default function CompaniesPage() {
  return <CompaniesScreen />;
}
