import { SignupForm } from "@/components/auth/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Cloud ERP",
  description: "Create a new Cloud ERP account",
};

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white mb-2">
          Create Your Account
        </h2>
        <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
          Enter your details below to get started with Cloud ERP
        </p>
      </div>

      <SignupForm />
    </div>
  );
}
