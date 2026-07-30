import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  organizationName?: string;
  companyName?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user: User, token: string) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth-token", token);
        }
        set({
          isAuthenticated: true,
          user,
          token,
        });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-token");
        }
        set({ isAuthenticated: false, user: null, token: null });
      },
    }),
    {
      name: "cloud-erp-auth-session",
    }
  )
);
