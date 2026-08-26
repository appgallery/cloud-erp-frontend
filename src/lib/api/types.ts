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
  baseCurrency?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MyCompanyEntry {
  companyId: string;
  companyName: string;
  baseCurrency?: string;
  roles: Array<{
    id: string;
    name: string;
    isOwnerRole?: boolean;
  }>;
}

export interface PermissionItem {
  id?: string;
  code: string;
  displayName: string;
  description: string;
  module: string;
  resource: string;
  action: string;
  isDangerous?: boolean;
}

export interface RoleDto {
  id: string;
  name: string;
  description?: string | null;
  isSystem: boolean;
  isEditable: boolean;
  isOwnerRole: boolean;
  isArchived: boolean;
  isTemplate?: boolean;
  companyId?: string | null;
  organizationId: string;
  tenantId: string;
  clonedFromId?: string | null;
  assignedUserCount?: number;
  permissionCodes?: string[];
  permissions?: PermissionItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleTemplateDto {
  key: string;
  name: string;
  description: string;
  isOwnerRole: boolean;
  permissionCodes: string[];
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionCodes: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface UpdateRolePermissionsDto {
  permissionCodes: string[];
}

export interface CloneRoleDto {
  name: string;
  description?: string;
}

export interface ArchiveRoleDto {
  reason?: string;
  force?: boolean;
}

export interface RoleUsageDto {
  roleId: string;
  count: number;
  users: Array<{
    id: string;
    email: string;
    isActive: boolean;
    assignedAt?: string;
  }>;
}

export interface AuditHistoryItem {
  id: string;
  tenantId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: any;
  after?: any;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CompanyUserDto {
  id: string;
  email: string;
  tenantId: string;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roleId?: string;
  roleName?: string;
  roles?: Array<{
    id: string;
    name: string;
  }>;
}

export interface CreateCompanyUserDto {
  email: string;
  password?: string;
  name?: string;
  roleId?: string;
}

