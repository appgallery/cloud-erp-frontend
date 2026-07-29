"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSidebarContext } from "./sidebar-context";
import { useAuthStore } from "@/store/use-auth-store";
import {
  Search,
  Menu,
  Sun,
  Moon,
  Bell,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSignOut = () => {
    setUserMenuOpen(false);
    logout();
    router.push("/login");
  };

  const displayName = user?.name || "Admin User";
  const displayEmail = user?.email || "admin@clouderp.com";
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-stroke bg-white px-4 dark:border-dark-3 dark:bg-gray-dark md:px-6 2xl:px-10 shadow-1">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg border border-stroke p-2 text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white lg:hidden hover:bg-gray-2 dark:hover:bg-dark-3 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {isMobile && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/images/logo/logo-dark.svg"
              alt="Cloud ERP"
              width={120}
              height={26}
              className="dark:hidden"
            />
            <Image
              src="/images/logo/logo.svg"
              alt="Cloud ERP"
              width={120}
              height={26}
              className="hidden dark:block"
            />
          </Link>
        )}

        <div className="hidden lg:block">
          <h1 className="text-xl font-bold text-dark dark:text-white">
            Cloud ERP
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            Enterprise Management Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Search Bar */}
        <div className="relative hidden sm:block w-64 lg:w-72">
          <input
            type="search"
            placeholder="Search records..."
            className="w-full rounded-full border border-stroke bg-gray-2 py-2 pl-10 pr-4 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-6" />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-gray-2 text-dark hover:text-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:text-primary transition cursor-pointer"
          aria-label="Toggle Theme"
        >
          <Sun className="h-5 w-5 hidden dark:block" />
          <Moon className="h-5 w-5 dark:hidden" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-gray-2 text-dark hover:text-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:text-primary transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-xl border border-stroke bg-white p-4 shadow-lg dark:border-dark-3 dark:bg-gray-dark z-50">
              <div className="flex items-center justify-between border-b border-stroke pb-3 dark:border-dark-3">
                <h3 className="font-semibold text-dark dark:text-white text-sm">Notifications</h3>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">2 New</span>
              </div>
              <div className="mt-3 space-y-3">
                <div className="text-xs">
                  <p className="font-medium text-dark dark:text-white">Sales Order #SO-102</p>
                  <p className="text-dark-5 dark:text-dark-6">Received 10m ago</p>
                </div>
                <div className="text-xs">
                  <p className="font-medium text-dark dark:text-white">Low Stock Alert: Item #SKU-89</p>
                  <p className="text-dark-5 dark:text-dark-6">1h ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 cursor-pointer outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-sm shadow-sm">
              {userInitials}
            </div>
            <div className="hidden text-left xl:block">
              <span className="block text-sm font-semibold text-dark dark:text-white">
                {displayName}
              </span>
              <span className="block text-xs font-medium text-dark-5 dark:text-dark-6">
                {user?.role || "Administrator"}
              </span>
            </div>
            <ChevronDown className="hidden xl:block h-4 w-4 text-dark-6" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-xl border border-stroke bg-white p-2 shadow-lg dark:border-dark-3 dark:bg-gray-dark z-50">
              <div className="px-3 py-2 border-b border-stroke dark:border-dark-3">
                <p className="font-semibold text-sm text-dark dark:text-white">{displayName}</p>
                <p className="text-xs text-dark-5 dark:text-dark-6 truncate">{displayEmail}</p>
              </div>

              <div className="py-2">
                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-dark-5 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-dark-3"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
