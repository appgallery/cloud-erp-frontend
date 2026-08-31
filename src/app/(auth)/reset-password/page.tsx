import React from "react";
import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | Cloud ERP",
  description: "Set your new account password",
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-dark dark:text-white sm:text-2xl">
          Set Account Password
        </h1>
        <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
          Enter your new password to secure your account and proceed.
        </p>
      </div>

      <ResetPasswordForm />
    </div>
  );
}
