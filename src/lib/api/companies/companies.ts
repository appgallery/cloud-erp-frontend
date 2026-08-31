import { apiClient } from '../baseApicall';
import {
  CompanyDto,
  CreateCompanyDto,
  UpdateCompanyDto,
  ListCompaniesQueryDto,
  PaginatedResponse,
} from '../types';

export const companiesApi = {

  listCompanies: async (
    actingCompanyId: string,
    query?: ListCompaniesQueryDto
  ): Promise<PaginatedResponse<CompanyDto>> => {
    const params: Record<string, any> = {
      companyId: actingCompanyId,
      ...query,
    };
    const response = await apiClient.get<PaginatedResponse<CompanyDto>>('/companies', {
      params,
    });
    return response.data;
  },

  createCompany: async (
    actingCompanyId: string,
    dto: CreateCompanyDto
  ): Promise<CompanyDto> => {
    const response = await apiClient.post<CompanyDto>('/companies', dto, {
      params: { companyId: actingCompanyId },
    });
    return response.data;
  },


  getCompany: async (companyId: string): Promise<CompanyDto> => {
    const response = await apiClient.get<CompanyDto>(`/companies/${companyId}`);
    return response.data;
  },

  updateCompany: async (companyId: string, dto: UpdateCompanyDto): Promise<CompanyDto> => {
    const response = await apiClient.patch<CompanyDto>(`/companies/${companyId}`, dto);
    return response.data;
  },
};
