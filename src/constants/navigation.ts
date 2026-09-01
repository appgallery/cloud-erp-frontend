import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  Map,
  Building,
  FolderTree,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface SubNavItem {
  title: string;
  href: string;
}

export interface NavItem {
  title: string;
  icon: LucideIcon;
  href?: string;
  badge?: string;
  items?: SubNavItem[];
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    group: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        items: [
          { title: "CRM Overview", href: "/dashboard/crm" },
        ],
      },
    ],
  },
  {
    group: "ORGANIZATION & STRUCTURE",
    items: [
      {
        title: "Companies",
        href: "/dashboard/organization/companies",
        icon: Building2,
      },
      {
        title: "Regions",
        href: "/dashboard/organization/regions",
        icon: Map,
      },
      {
        title: "Branches",
        href: "/dashboard/organization/branches",
        icon: Building,
      },
      {
        title: "Departments",
        href: "/dashboard/organization/departments",
        icon: FolderTree,
      },
    ],
  },
  {
    group: "ADMINISTRATION & SECURITY",
    items: [
      {
        title: "Roles & Permissions",
        href: "/dashboard/settings/roles",
        icon: ShieldCheck,
      },
      {
        title: "User Management",
        href: "/dashboard/settings/users",
        icon: Users,
      },
    ],
  },
];