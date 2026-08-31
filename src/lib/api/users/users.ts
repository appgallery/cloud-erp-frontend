import { client } from '../client';
import {
  CompanyUserDto,
  CreateCompanyUserDto,
  PaginatedResponse,
} from '../types';

export interface ListUsersQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  unassignedOnly?: boolean;
  sortBy?: 'email' | 'createdAt' | 'updatedAt';
  sortDir?: 'asc' | 'desc';
}

export const usersApi = {
  listCompanyUsers: async (
    companyId: string,
    params?: ListUsersQuery
  ): Promise<PaginatedResponse<CompanyUserDto>> => {
    const response = await client.get<PaginatedResponse<CompanyUserDto>>(
      `/companies/${companyId}/users`,
      { params }
    );
    return response.data;
  },

  createCompanyUser: async (
    companyId: string,
    data: CreateCompanyUserDto
  ): Promise<CompanyUserDto> => {
    const response = await client.post<CompanyUserDto>(
      `/companies/${companyId}/users`,
      data
    );
    return response.data;
  },

  getUser: async (
    companyId: string,
    userId: string
  ): Promise<CompanyUserDto> => {
    const response = await client.get<CompanyUserDto>(
      `/companies/${companyId}/users/${userId}`
    );
    return response.data;
  },

  activateUser: async (
    companyId: string,
    userId: string
  ): Promise<CompanyUserDto> => {
    const response = await client.patch<CompanyUserDto>(
      `/companies/${companyId}/users/${userId}/activate`
    );
    return response.data;
  },

  deactivateUser: async (
    companyId: string,
    userId: string
  ): Promise<CompanyUserDto> => {
    const response = await client.patch<CompanyUserDto>(
      `/companies/${companyId}/users/${userId}/deactivate`
    );
    return response.data;
  },
};
