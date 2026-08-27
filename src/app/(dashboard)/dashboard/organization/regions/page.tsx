import React from "react";
import { RegionsScreen } from "@/screens/regions/regions-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regions & Territories | Cloud ERP",
  description: "Manage geographical regions and organizational hierarchy trees.",
};

export default function RegionsPage() {
  return <RegionsScreen />;
}
