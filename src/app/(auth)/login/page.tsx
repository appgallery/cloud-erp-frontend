import { SigninForm } from "@/components/auth/signin-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Cloud ERP",
  description: "Sign in to your Cloud ERP account",
};

export default function LoginPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white mb-2">
          Sign In to Cloud ERP
        </h2>
        <p className="text-sm font-medium text-dark-4 dark:text-dark-6">
          Please enter your credentials to access your account
        </p>
      </div>

      <SigninForm />
    </div>
  );
}
