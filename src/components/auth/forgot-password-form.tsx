"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { EmailIcon } from "@/components/common/icons";
import { InputGroup } from "@/components/forms/input-group";
import { authApi } from "@/lib/api/auth/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword({ email: email.trim() });
      setSubmitted(true);
      toast.success(`Password reset instructions sent to ${email}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {submitted ? (
        <div className="rounded-2xl border border-stroke bg-gray-2/60 p-6 dark:border-dark-3 dark:bg-dark-2/60 text-center space-y-4 shadow-xs">
          <h3 className="text-lg font-bold text-dark dark:text-white">Check Your Inbox</h3>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            If an account exists for <span className="font-semibold text-dark dark:text-white">{email}</span>, you will receive an email with instructions to reset your password.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Try another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <InputGroup
            type="email"
            label="Email Address"
            className="mb-6"
            placeholder="Enter your registered email"
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
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary p-3.5 font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 text-xs shadow-xs"
            >
              Send Reset Instructions
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
              )}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center text-xs text-dark-5 dark:text-dark-6">
        <p>
          Remember your password?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
