"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmailIcon, PasswordIcon } from "@/components/common/icons";
import { InputGroup } from "@/components/forms/input-group";
import { authApi } from "@/lib/api/auth/auth";

type Step = "EMAIL" | "OTP" | "RESET";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email.includes("@")) throw new Error("Please enter a valid email address");
      await authApi.sendOtp(email);
      toast.success(`OTP sent to ${email}`);
      setStep("OTP");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to send OTP";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (otp.length < 4) throw new Error("Please enter a valid OTP");
      await authApi.verifyOtp({ email, otp });
      toast.success("OTP verified successfully");
      setStep("RESET");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Invalid OTP";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (password.length < 6) throw new Error("Password must be at least 6 characters");
      if (password !== confirmPassword) throw new Error("Passwords do not match");
      
      await authApi.resetPassword({ email, otp, password });
      toast.success("Password changed successfully!");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* STEP 1: EMAIL */}
      {step === "EMAIL" && (
        <form onSubmit={handleEmailSubmit}>
          <InputGroup
            type="email"
            label="Email Address"
            className="mb-6"
            placeholder="Enter your email address"
            name="email"
            handleChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            icon={<EmailIcon />}
            iconPosition="right"
          />

          <div className="mb-4.5">
            <button
              type="submit"
              disabled={loading || !email}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-3.5 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70 text-sm"
            >
              Send OTP
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: OTP */}
      {step === "OTP" && (
        <form onSubmit={handleOtpSubmit}>
          <div className="mb-4 text-sm font-medium text-dark-5 dark:text-dark-6">
            Enter the OTP sent to <span className="font-bold text-dark dark:text-white">{email}</span>
          </div>
          <InputGroup
            type="text"
            label="One-Time Password (OTP)"
            className="mb-6"
            placeholder="Enter OTP"
            name="otp"
            handleChange={(e) => setOtp(e.target.value)}
            value={otp}
            required
          />

          <div className="mb-4.5 flex gap-3">
            <button
              type="button"
              onClick={() => setStep("EMAIL")}
              className="flex w-1/3 cursor-pointer items-center justify-center rounded-lg border border-stroke bg-gray-2 p-3.5 font-medium text-dark transition hover:bg-opacity-90 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-opacity-90 text-sm"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || !otp}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-3.5 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70 text-sm"
            >
              Verify OTP
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: RESET PASSWORD */}
      {step === "RESET" && (
        <form onSubmit={handleResetSubmit}>
          <div className="mb-4 text-sm font-medium text-dark-5 dark:text-dark-6">
            Please enter your new password below.
          </div>
          <InputGroup
            type="password"
            label="New Password"
            className="mb-4"
            placeholder="Enter new password"
            name="password"
            handleChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            icon={<PasswordIcon />}
            iconPosition="right"
          />
          <InputGroup
            type="password"
            label="Confirm Password"
            className="mb-6"
            placeholder="Re-enter new password"
            name="confirmPassword"
            handleChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
            icon={<PasswordIcon />}
            iconPosition="right"
          />

          <div className="mb-4.5">
            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-3.5 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70 text-sm"
            >
              Reset Password
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
              )}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center text-sm text-dark-5 dark:text-dark-6">
        <p>
          Remember your password?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
