import React from "react";
import { Metadata } from "next";
import { SetPasswordForm } from "@/components/auth/set-password-form";

export const metadata: Metadata = {
  title: "Set Password | Cloud ERP",
  description: "Configure your new account password",
};

export default function SetPasswordPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-dark dark:text-white sm:text-2xl">
          Set Account Password
        </h1>
        <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
          Create a secure password to activate your account access and sign in.
        </p>
      </div>

      <SetPasswordForm />
    </div>
  );
}
