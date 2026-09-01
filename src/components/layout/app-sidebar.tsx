"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/constants/navigation";
import { useSidebarContext } from "./sidebar-context";
import { CompanySwitcher } from "./company-switcher";
import { X, ChevronRight, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

export function AppSidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  useEffect(() => {
    // Keep collapsible open when its subpage is active
    navigation.forEach((group) => {
      group.items.forEach((item) => {
        if (item.items) {
          const isSubActive = item.items.some(
            (subItem) => pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
          );
          if (isSubActive && !expandedItems.includes(item.title)) {
            setExpandedItems((prev) => [...prev, item.title]);
          }
        }
      });
    });
  }, [pathname]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark/60 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          "bg-white dark:bg-gray-dark border-r border-stroke dark:border-dark-3 transition-all duration-300 ease-in-out z-50 flex flex-col",
          isMobile
            ? "fixed inset-y-0 left-0 w-72 shadow-2"
            : "sticky top-0 h-screen",
          !isOpen && !isMobile && "w-0 overflow-hidden border-none",
          isOpen && !isMobile && "w-64 min-w-[16rem]",
          !isOpen && isMobile && "-translate-x-full"
        )}
      >
        {/* Brand / Logo Header */}
        <div className="flex h-[72px] items-center justify-between px-6 border-b border-stroke dark:border-dark-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src="/images/logo/logo-dark.svg"
              alt="Cloud ERP"
              width={140}
              height={32}
              className="dark:hidden"
            />
            <Image
              src="/images/logo/logo.svg"
              alt="Cloud ERP"
              width={140}
              height={32}
              className="hidden dark:block"
            />
          </Link>

          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Active Company — compact switcher (shown in sidebar on all sizes) */}
        <div className="border-b border-stroke px-4 py-3 dark:border-dark-3 md:hidden">
          <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Active Company
          </p>
          <CompanySwitcher compact />
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6">
          <nav className="space-y-6">
            {navigation.map((group) => (
              <div key={group.group}>
                <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-dark-5 dark:text-dark-6">
                  {group.group}
                </h3>
                <ul className="space-y-1.5">
                  {group.items.map((item) => {
                    const hasSubItems = item.items && item.items.length > 0;
                    
                    // For standalone items
                    let active = false;
                    if (!hasSubItems && item.href) {
                      active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    } else if (hasSubItems) {
                      active = item.items!.some((subItem) => pathname === subItem.href || pathname.startsWith(`${subItem.href}/`));
                    }
                    
                    const isExpanded = expandedItems.includes(item.title);
                    const Icon = item.icon;

                    return (
                      <li key={item.title}>
                        {hasSubItems ? (
                          <>
                            <button
                              onClick={() => toggleExpanded(item.title)}
                              className={clsx(
                                "flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-150 cursor-pointer",
                                active && !isExpanded
                                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                                  : "text-dark-5 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
                              )}
                            >
                              <div className="flex items-center gap-3.5">
                                <Icon className={clsx("h-5 w-5", active && !isExpanded ? "text-primary" : "text-dark-5 dark:text-dark-6")} />
                                <span>{item.title}</span>
                              </div>
                              <ChevronDown 
                                className={clsx("h-4 w-4 transition-transform duration-200", isExpanded ? "rotate-180" : "opacity-70")} 
                              />
                            </button>

                            {/* Dropdown Items */}
                            {isExpanded && (
                              <ul className="mt-1.5 space-y-1.5 overflow-hidden">
                                {item.items!.map((subItem) => {
                                  const subActive = pathname === subItem.href || pathname.startsWith(`${subItem.href}/`);
                                  
                                  return (
                                    <li key={subItem.title}>
                                      <Link
                                        href={subItem.href}
                                        onClick={() => isMobile && setIsOpen(false)}
                                        className={clsx(
                                          "flex items-center gap-3.5 rounded-xl pl-[3.25rem] pr-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                                          subActive
                                            ? "bg-primary text-white shadow-1 dark:shadow-none"
                                            : "text-dark-5 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
                                        )}
                                      >
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </>
                        ) : (
                          <Link
                            href={item.href!}
                            onClick={() => isMobile && setIsOpen(false)}
                            className={clsx(
                              "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-150",
                              active
                                ? "bg-primary text-white shadow-1 dark:shadow-none"
                                : "text-dark-5 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
                            )}
                          >
                            <div className="flex items-center gap-3.5">
                              <Icon className={clsx("h-5 w-5", active ? "text-white" : "text-dark-5 dark:text-dark-6")} />
                              <span>{item.title}</span>
                            </div>

                            {item.badge ? (
                              <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                                {item.badge}
                              </span>
                            ) : null}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* User Card at Sidebar Bottom */}
        <div className="p-4 border-t border-stroke dark:border-dark-3 mt-auto">
          <div className="flex items-center gap-3 rounded-xl bg-gray-2 p-3 dark:bg-dark-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-white text-xs">
              ERP
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-dark dark:text-white truncate">Cloud ERP v1.0</p>
              <p className="text-[11px] text-dark-5 dark:text-dark-6 truncate">Enterprise Edition</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}