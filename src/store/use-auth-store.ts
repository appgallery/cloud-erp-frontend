import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser, TokenPair, JwtPayload } from "@/lib/api/types";

export function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  tenantId: string | null;
  user: AuthUser | null;
  setAuth: (tokens: TokenPair, extraUser?: Partial<AuthUser>, fallbackTenantId?: string) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      tenantId: null,
      user: null,

      setAuth: (tokens: TokenPair, extraUser?: Partial<AuthUser>, fallbackTenantId?: string) => {
        const payload = parseJwtPayload(tokens.accessToken);
        const tenantId = payload?.tenantId || fallbackTenantId || null;
        
        const user: AuthUser = {
          id: payload?.sub || extraUser?.id || "",
          email: payload?.email || extraUser?.email || "",
          tenantId: tenantId || "",
          organizationId: payload?.organizationId || extraUser?.organizationId,
          companyId: extraUser?.companyId,
          companyName: extraUser?.companyName,
          name: extraUser?.name || extraUser?.email?.split("@")[0] || "User",
          role: extraUser?.role || "User",
        };

        set({
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tenantId,
          user,
        });
      },

      updateTokens: (accessToken: string, refreshToken: string) => {
        const payload = parseJwtPayload(accessToken);
        const tenantId = payload?.tenantId;

        set((state) => ({
          accessToken,
          refreshToken,
          tenantId: tenantId || state.tenantId,
          user: state.user && payload ? {
            ...state.user,
            id: payload.sub,
            email: payload.email,
            tenantId: tenantId || state.user.tenantId,
            organizationId: payload.organizationId,
          } : state.user,
        }));
      },

      logout: () => {
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          tenantId: null,
          user: null,
        });
      },
    }),
    {
      name: "cloud-erp-auth-session",
    }
  )
);
