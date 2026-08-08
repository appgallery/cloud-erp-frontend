"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { EmailIcon } from "@/components/common/icons";
import { InputGroup } from "@/components/forms/input-group";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }
      
      // Simulate clean request submission notification
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      toast.success(`Password reset instructions sent to ${email}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {submitted ? (
        <div className="rounded-xl border border-stroke bg-gray-2 p-6 dark:border-dark-3 dark:bg-dark-2 text-center space-y-4">
          <h3 className="text-lg font-bold text-dark dark:text-white">Check Your Inbox</h3>
          <p className="text-sm text-dark-5 dark:text-dark-6">
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
