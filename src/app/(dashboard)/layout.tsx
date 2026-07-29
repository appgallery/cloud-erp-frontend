"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { AppLayout } from "@/components/layout/app-layout";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isMounted, isAuthenticated, router]);

  if (!isMounted || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-2 dark:bg-[#020D1A]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-dark dark:text-white">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}