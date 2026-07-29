import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email: string) => {
        const username = email ? email.split("@")[0] : "Admin User";
        const formattedName =
          username.charAt(0).toUpperCase() + username.slice(1);
        set({
          isAuthenticated: true,
          user: {
            name: formattedName || "Admin User",
            email: email || "admin@clouderp.com",
            role: "System Administrator",
          },
        });
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "cloud-erp-auth-session",
    }
  )
);
