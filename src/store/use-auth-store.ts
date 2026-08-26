import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser, TokenPair, JwtPayload, MyCompanyEntry } from "@/lib/api/types";
import { authApi } from "@/lib/api/auth/auth";

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
  activeCompanyId: string | null;
  activeCompanyName: string | null;
  companies: MyCompanyEntry[];
  user: AuthUser | null;
  setAuth: (tokens: TokenPair, extraUser?: Partial<AuthUser>, fallbackTenantId?: string) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  setActiveCompany: (companyId: string, companyName?: string) => void;
  fetchMyCompanies: () => Promise<MyCompanyEntry[]>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      tenantId: null,
      activeCompanyId: null,
      activeCompanyName: null,
      companies: [],
      user: null,

      setAuth: (tokens: TokenPair, extraUser?: Partial<AuthUser>, fallbackTenantId?: string) => {
        const payload = parseJwtPayload(tokens.accessToken);
        const tenantId = payload?.tenantId || fallbackTenantId || null;
        
        const companyId = extraUser?.companyId || null;
        const companyName = extraUser?.companyName || null;

        const user: AuthUser = {
          id: payload?.sub || extraUser?.id || "",
          email: payload?.email || extraUser?.email || "",
          tenantId: tenantId || "",
          organizationId: payload?.organizationId || extraUser?.organizationId,
          companyId: companyId || undefined,
          companyName: companyName || undefined,
          name: extraUser?.name || extraUser?.email?.split("@")[0] || "User",
          role: extraUser?.role || "User",
        };

        set({
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tenantId,
          activeCompanyId: companyId,
          activeCompanyName: companyName,
          user,
        });

        // Auto fetch companies in background if companyId isn't provided
        get().fetchMyCompanies().catch(() => {});
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

      setActiveCompany: (companyId: string, companyName?: string) => {
        set((state) => ({
          activeCompanyId: companyId,
          activeCompanyName: companyName || state.activeCompanyName,
          user: state.user ? { ...state.user, companyId, companyName: companyName || state.user.companyName } : null,
        }));
      },

      fetchMyCompanies: async (): Promise<MyCompanyEntry[]> => {
        try {
          const res = await authApi.getMyCompanies();
          const items: MyCompanyEntry[] = Array.isArray(res)
            ? res.map((item: any) => ({
                companyId: item.companyId || item.id,
                companyName: item.companyName || item.name,
                baseCurrency: item.baseCurrency,
                roles: item.roles || [],
              }))
            : [];

          set((state) => {
            const currentActive = state.activeCompanyId;
            const validActive = items.find((c) => c.companyId === currentActive)
              ? currentActive
              : items[0]?.companyId || null;
            const validName = items.find((c) => c.companyId === validActive)?.companyName || state.activeCompanyName;

            return {
              companies: items,
              activeCompanyId: validActive,
              activeCompanyName: validName,
              user: state.user ? { ...state.user, companyId: validActive || undefined, companyName: validName || undefined } : null,
            };
          });

          return items;
        } catch (error) {
          return [];
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          tenantId: null,
          activeCompanyId: null,
          activeCompanyName: null,
          companies: [],
          user: null,
        });
      },
    }),
    {
      name: "cloud-erp-auth-session",
    }
  )
);
