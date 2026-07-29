import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Cloud ERP",
  description: "Reset your Cloud ERP account password",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white mb-2">
          Forgot Your Password?
        </h2>
        <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}
