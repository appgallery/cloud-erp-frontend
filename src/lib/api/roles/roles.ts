import { client } from '../client';
import {
  RoleDto,
  RoleTemplateDto,
  CreateRoleDto,
  UpdateRoleDto,
  UpdateRolePermissionsDto,
  CloneRoleDto,
  ArchiveRoleDto,
  RoleUsageDto,
  AuditHistoryItem,
  PaginatedResponse,
} from '../types';

export interface ListRolesQuery {
  includeArchived?: boolean;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const rolesApi = {
  listRoles: async (
    companyId: string,
    query?: ListRolesQuery
  ): Promise<PaginatedResponse<RoleDto>> => {
    const response = await client.get<PaginatedResponse<RoleDto>>(
      `/companies/${companyId}/roles`,
      { params: query }
    );
    return response.data;
  },

  createRole: async (
    companyId: string,
    data: CreateRoleDto
  ): Promise<RoleDto> => {
    const response = await client.post<RoleDto>(
      `/companies/${companyId}/roles`,
      data
    );
    return response.data;
  },

  listRoleTemplates: async (companyId: string): Promise<RoleTemplateDto[]> => {
    const response = await client.get<RoleTemplateDto[]>(
      `/companies/${companyId}/roles/templates`
    );
    return response.data;
  },

  getRoleDetail: async (
    companyId: string,
    roleId: string
  ): Promise<RoleDto> => {
    const response = await client.get<RoleDto>(
      `/companies/${companyId}/roles/${roleId}`
    );
    return response.data;
  },

  updateRole: async (
    companyId: string,
    roleId: string,
    data: UpdateRoleDto
  ): Promise<RoleDto> => {
    const response = await client.patch<RoleDto>(
      `/companies/${companyId}/roles/${roleId}`,
      data
    );
    return response.data;
  },

  updateRolePermissions: async (
    companyId: string,
    roleId: string,
    data: UpdateRolePermissionsDto
  ): Promise<RoleDto> => {
    const response = await client.put<RoleDto>(
      `/companies/${companyId}/roles/${roleId}/permissions`,
      data
    );
    return response.data;
  },

  cloneRole: async (
    companyId: string,
    roleId: string,
    data: CloneRoleDto
  ): Promise<RoleDto> => {
    const response = await client.post<RoleDto>(
      `/companies/${companyId}/roles/${roleId}/clone`,
      data
    );
    return response.data;
  },

  archiveRole: async (
    companyId: string,
    roleId: string,
    data?: ArchiveRoleDto
  ): Promise<RoleDto> => {
    const response = await client.patch<RoleDto>(
      `/companies/${companyId}/roles/${roleId}/archive`,
      data || {}
    );
    return response.data;
  },

  restoreRole: async (
    companyId: string,
    roleId: string
  ): Promise<RoleDto> => {
    const response = await client.patch<RoleDto>(
      `/companies/${companyId}/roles/${roleId}/restore`
    );
    return response.data;
  },

  getRoleUsage: async (
    companyId: string,
    roleId: string
  ): Promise<RoleUsageDto> => {
    const response = await client.get<RoleUsageDto>(
      `/companies/${companyId}/roles/${roleId}/usage`
    );
    return response.data;
  },

  getRoleAuditHistory: async (
    companyId: string,
    roleId: string,
    params?: { page?: number; pageSize?: number }
  ): Promise<PaginatedResponse<AuditHistoryItem>> => {
    const response = await client.get<PaginatedResponse<AuditHistoryItem>>(
      `/companies/${companyId}/roles/${roleId}/audit-history`,
      { params }
    );
    return response.data;
  },

  assignUserToRole: async (
    companyId: string,
    roleId: string,
    userId: string
  ): Promise<{ roleId: string; userId: string; companyId: string }> => {
    const response = await client.post<{
      roleId: string;
      userId: string;
      companyId: string;
    }>(`/companies/${companyId}/roles/${roleId}/users/${userId}`);
    return response.data;
  },

  removeUserFromRole: async (
    companyId: string,
    roleId: string,
    userId: string
  ): Promise<{ roleId: string; userId: string; companyId: string }> => {
    const response = await client.delete<{
      roleId: string;
      userId: string;
      companyId: string;
    }>(`/companies/${companyId}/roles/${roleId}/users/${userId}`);
    return response.data;
  },
};
