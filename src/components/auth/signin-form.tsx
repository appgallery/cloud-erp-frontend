"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmailIcon, PasswordIcon } from "@/components/common/icons";
import { InputGroup } from "@/components/forms/input-group";
import { Checkbox } from "@/components/forms/checkbox";
import { useAuthStore } from "@/store/use-auth-store";

export function SigninForm() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [data, setData] = useState({
    email: "admin@clouderp.com",
    password: "••••••••",
    remember: true,
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
      if (!data.email || !data.password) {
        throw new Error("Email and password are required");
      }

      await new Promise((resolve) => setTimeout(resolve, 400));
      login(data.email);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
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
          className="mb-5"
          placeholder="Enter your password"
          name="password"
          handleChange={handleChange}
          value={data.password}
          required
          icon={<PasswordIcon />}
          iconPosition="right"
        />

        <div className="mb-6 flex items-center justify-between font-medium text-sm">
          <Checkbox
            label="Remember me"
            name="remember"
            checked={data.remember}
            onChange={(e) =>
              setData({
                ...data,
                remember: e.target.checked,
              })
            }
          />

          <Link
            href="/forgot-password"
            className="text-primary hover:underline font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mb-4.5">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-3.5 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70 text-sm"
          >
            Sign In
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
            )}
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </form>

      <div className="mt-6 text-center text-sm text-dark-5 dark:text-dark-6">
        <p>
          Don’t have an account?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
