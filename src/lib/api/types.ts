export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  organizationName: string;
  companyName: string;
  email: string;
  password: string;
}

export interface RefreshDto {
  tenantId: string;
  refreshToken: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface SignupResponse extends TokenPair {
  companyId: string;
  companyName: string;
}

export interface AuthUser {
  id: string;
  email: string;
  tenantId: string;
  organizationId?: string;
  companyId?: string;
  companyName?: string;
  name?: string;
  role?: string;
}

export interface JwtPayload {
  sub: string;
  tenantId: string;
  organizationId: string;
  email: string;
  pv: number;
  exp?: number;
  iat?: number;
}

export interface Company {
  id: string;
  name: string;
  tenantId: string;
  organizationId: string;
  createdAt?: string;
  updatedAt?: string;
}
