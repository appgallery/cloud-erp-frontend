"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "./sidebar-context";
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-2 dark:bg-[#020D1A] font-sans antialiased text-dark dark:text-white">
        <AppSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <Header />
          <main className="flex-1 p-4 md:p-6 2xl:p-10">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}