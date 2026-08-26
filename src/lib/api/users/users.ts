import { client } from '../client';
import {
  CompanyUserDto,
  CreateCompanyUserDto,
  PaginatedResponse,
} from '../types';

export const usersApi = {
  listCompanyUsers: async (
    companyId: string,
    params?: { page?: number; pageSize?: number }
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
};
