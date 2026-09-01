"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Lock,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { authApi } from "@/lib/api/auth/auth";

function SetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  // Real-time password criteria
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isFormValid =
    token.trim().length > 0 &&
    hasMinLength &&
    passwordsMatch;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token.trim()) {
      toast.error("A valid verification token is required");
      return;
    }

    if (!hasMinLength) {
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
      toast.success("Password configured successfully!");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to set password. The activation link may be invalid or expired.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseWindow = () => {
    try {
      window.close();
    } catch {
      // In case window.close is prevented by browser policy
      router.push("/login");
    }
  };

  // SUCCESS UI STATE
  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-stroke bg-white p-8 text-center shadow-1 dark:border-dark-3 dark:bg-gray-dark animate-in fade-in zoom-in-95 duration-200">
        {/* Animated Badge */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green ring-8 ring-green-50/50 dark:bg-green-950/40 dark:text-green-400 dark:ring-green-900/20">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-bold text-dark dark:text-white sm:text-2xl">
          Password Set Successfully!
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-dark-5 dark:text-dark-6 max-w-sm mx-auto">
          Your account password has been securely updated. You can now close this tab and return to your original screen to log in with your new credentials.
        </p>

        {/* Informative Hint Box */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-left dark:border-primary/30 dark:bg-primary/10">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-dark dark:text-white">What should I do next?</p>
            <p className="mt-0.5 text-dark-5 dark:text-dark-6">
              Switch back to your previous browser tab and enter your email and newly created password.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleCloseWindow}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-stroke bg-white px-5 py-3 text-xs font-bold text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 transition shadow-xs cursor-pointer"
          >
            Close This Tab
          </button>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // FORM STATE
  return (
    <div className="w-full">
      {errorMessage && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-4 text-left dark:border-red-900/50 dark:bg-red-950/30 animate-in fade-in">
          <XCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-red-700 dark:text-red-400">Unable to Set Password</p>
            <p className="mt-0.5 text-red-600 dark:text-red-300">{errorMessage}</p>
            <div className="mt-2">
              <Link
                href="/forgot-password"
                className="font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                Request a new password link &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Token Input (shown only if not present in URL) */}
        {!tokenFromUrl && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
              Activation / Reset Token <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
              <input
                type="text"
                required
                placeholder="Paste token received in email or invite"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 pl-10 pr-3.5 text-xs text-dark font-mono focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
              />
            </div>
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="Enter secure password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 pl-10 pr-10 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white cursor-pointer p-1"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-dark dark:text-white">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-stroke bg-gray-2 py-2.5 pl-10 pr-10 text-xs text-dark focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white cursor-pointer p-1"
              title={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Password Strength Checklist */}
        {newPassword.length > 0 && (
          <div className="rounded-xl border border-stroke bg-gray-2/60 p-3 dark:border-dark-3 dark:bg-dark-2/60 space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${hasMinLength ? "bg-green" : "bg-dark-5"}`} />
              <span className={hasMinLength ? "font-semibold text-green" : "text-dark-5 dark:text-dark-6"}>
                At least 8 characters
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${passwordsMatch ? "bg-green" : "bg-dark-5"}`} />
              <span className={passwordsMatch ? "font-semibold text-green" : "text-dark-5 dark:text-dark-6"}>
                Passwords match exactly
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary p-3.5 font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 text-xs shadow-xs"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                <span>Configuring Password...</span>
              </>
            ) : (
              <span>Save & Set Password</span>
            )}
          </button>
        </div>

        <div className="text-center text-xs text-dark-5 dark:text-dark-6 pt-2">
          <p>
            Already have your credentials?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export function SetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-dark-5">
          <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Loading security verification...
        </div>
      }
    >
      <SetPasswordFormInner />
    </Suspense>
  );
}
