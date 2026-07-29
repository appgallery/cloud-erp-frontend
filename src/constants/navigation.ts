import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Users,
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
          { title: "Analytics", href: "#" },
        ],
      },
      {
        title: "Inventory",
        href: "#",
        icon: Package,
      },
      {
        title: "Sales",
        href: "#",
        icon: ShoppingCart,
      },
    ],
  },
  {
    group: "SETTINGS",
    items: [
      {
        title: "System Settings",
        href: "#",
        icon: Settings,
      },
      {
        title: "User Management",
        href: "#",
        icon: Users,
      },
    ],
  },
];