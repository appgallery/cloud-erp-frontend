"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmailIcon, PasswordIcon, UserIcon } from "@/components/common/icons";
import { InputGroup } from "@/components/forms/input-group";
import { useAuthStore } from "@/store/use-auth-store";
import { Building2 } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [data, setData] = useState({
    organizationName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      if (!data.organizationName || !data.companyName) {
        throw new Error("Organization and Company names are required");
      }

      await new Promise((resolve) => setTimeout(resolve, 400));
      login(data.email || "newuser@clouderp.com");
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <InputGroup
          type="text"
          label="Organization Name"
          className="mb-4"
          placeholder="Enter your organization name"
          name="organizationName"
          handleChange={handleChange}
          value={data.organizationName}
          required
          icon={<Building2 className="h-5 w-5 text-dark-5 dark:text-dark-6" />}
          iconPosition="right"
        />

        <InputGroup
          type="text"
          label="Company Name"
          className="mb-4"
          placeholder="Enter your company name"
          name="companyName"
          handleChange={handleChange}
          value={data.companyName}
          required
          icon={<Building2 className="h-5 w-5 text-dark-5 dark:text-dark-6" />}
          iconPosition="right"
        />

        <InputGroup
          type="email"
          label="Email Address"
          className="mb-4"
          placeholder="Enter your email address"
          name="email"
          handleChange={handleChange}
          value={data.email}
          required
          icon={<EmailIcon />}
          iconPosition="right"
        />

        <InputGroup
          type="password"
          label="Password"
          className="mb-4"
          placeholder="Create a strong password"
          name="password"
          handleChange={handleChange}
          value={data.password}
          required
          icon={<PasswordIcon />}
          iconPosition="right"
        />

        <InputGroup
          type="password"
          label="Confirm Password"
          className="mb-5"
          placeholder="Re-enter your password"
          name="confirmPassword"
          handleChange={handleChange}
          value={data.confirmPassword}
          required
          icon={<PasswordIcon />}
          iconPosition="right"
        />

        <div className="mb-4.5">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-3.5 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70 text-sm"
          >
            Create Account
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
            )}
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </form>

      <div className="mt-6 text-center text-sm text-dark-5 dark:text-dark-6">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
