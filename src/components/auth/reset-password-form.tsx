"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Lock, CheckCircle2, KeyRound } from "lucide-react";
import { authApi } from "@/lib/api/auth/auth";

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token.trim()) {
      toast.error("A valid verification token is required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        token: token.trim(),
        newPassword,
      });
      setIsSuccess(true);
      toast.success("Password reset successfully! You can now log in.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-stroke bg-gray-2/60 p-6 dark:border-dark-3 dark:bg-dark-2/60 text-center space-y-4 shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green dark:bg-green-950/40">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-dark dark:text-white">Password Updated</h3>
        <p className="text-xs text-dark-5 dark:text-dark-6">
          Your credentials have been securely updated. Redirecting to login...
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!tokenFromUrl && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
            Reset Token <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
            <input
              type="text"
              required
              placeholder="Paste token from email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 pl-10 pr-3.5 text-xs text-dark font-mono focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
            />
          </div>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
          New Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
          <input
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 pl-10 pr-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
          Confirm New Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 pl-10 pr-3.5 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || !newPassword || !confirmPassword}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary p-3.5 font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 text-xs shadow-xs"
        >
          {loading ? "Updating Password..." : "Set New Password"}
        </button>
      </div>

      <div className="text-center text-xs text-dark-5 dark:text-dark-6">
        <p>
          Back to{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<div className="text-center text-xs text-dark-5">Loading reset form...</div>}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
