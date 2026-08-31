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
  roleId?: string;
}


export interface CreateCompanyDto {
  name: string;
  code: string;
  baseCurrency?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  timezone?: string;
}

export interface UpdateCompanyDto {
  name?: string;
  baseCurrency?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  timezone?: string;
}

export interface ListCompaniesQueryDto {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'name' | 'code' | 'createdAt' | 'updatedAt';
  sortDir?: 'asc' | 'desc';
  isActive?: boolean;
}

export interface CompanyDto {
  id: string;
  tenantId: string;
  organizationId: string;
  name: string;
  code: string;
  baseCurrency: string;
  isActive: boolean;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  taxId?: string | null;
  timezone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegionDto {
  name: string;
  code: string;
  parentId?: string;
}

export interface UpdateRegionDto {
  name?: string;
  parentId?: string | null;
  isActive?: boolean;
}

export interface ListRegionsQueryDto {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'name' | 'code' | 'createdAt' | 'updatedAt';
  sortDir?: 'asc' | 'desc';
  isActive?: boolean;
}

export interface RegionDto {
  id: string;
  tenantId: string;
  companyId: string;
  name: string;
  code: string;
  parentId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parent?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface RegionTreeNode {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  isActive: boolean;
  children: RegionTreeNode[];
}

export type BranchType = 'HEAD_OFFICE' | 'SALES' | 'WAREHOUSE' | 'SERVICE_CENTER' | 'FACTORY';

export interface CreateBranchDto {
  name: string;
  code: string;
  type?: BranchType;
  regionId?: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  state: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
}

export interface UpdateBranchDto {
  name?: string;
  type?: BranchType;
  regionId?: string | null;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
}

export interface ListBranchesQueryDto {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'name' | 'code' | 'city' | 'state' | 'createdAt' | 'updatedAt';
  sortDir?: 'asc' | 'desc';
  city?: string;
  state?: string;
  country?: string;
  regionId?: string;
  type?: BranchType;
  isActive?: boolean;
}

export interface BranchDto {
  id: string;
  tenantId: string;
  companyId: string;
  regionId?: string | null;
  name: string;
  code: string;
  type: BranchType;
  isActive: boolean;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
  region?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface DepartmentDto {
  id: string;
  tenantId: string;
  companyId: string;
  branchId: string;
  name: string;
  code: string;
  parentId?: string | null;
  headUserId?: string | null;
  description?: string | null;
  isActive: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  headUser?: {
    id: string;
    email: string;
  } | null;
  parent?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface DepartmentTreeNode {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  isActive: boolean;
  headUserId: string | null;
  children: DepartmentTreeNode[];
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  parentId?: string;
  headUserId?: string;
  description?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  parentId?: string | null;
  headUserId?: string | null;
  description?: string;
  isActive?: boolean;
}

export interface ListDepartmentsQueryDto {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'name' | 'code' | 'createdAt' | 'updatedAt';
  sortDir?: 'asc' | 'desc';
  parentId?: string;
  isActive?: boolean;
}



