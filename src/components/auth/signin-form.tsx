"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmailIcon, PasswordIcon } from "@/components/common/icons";
import { InputGroup } from "@/components/forms/input-group";
import { Checkbox } from "@/components/forms/checkbox";
import { useAuthStore } from "@/store/use-auth-store";
import { authApi } from "@/lib/api/auth/auth";
import { toast } from "sonner";

export function SigninForm() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [data, setData] = useState({
    email: "admin@clouderp.com",
    password: "••••••••",
    remember: true,
  });
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      if (!data.email || !data.password) {
        throw new Error("Email and password are required");
      }

      // Call the real API endpoint
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      login(response.user, response.token);
      toast.success("Successfully signed in!");
      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Sign in failed";
      toast.error(errorMessage);
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
