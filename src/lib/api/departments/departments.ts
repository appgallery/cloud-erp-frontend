import { apiClient } from '../baseApicall';
import {
  DepartmentDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  ListDepartmentsQueryDto,
  DepartmentTreeNode,
  PaginatedResponse,
} from '../types';

export const departmentsApi = {
  createDepartment: async (
    companyId: string,
    branchId: string,
    dto: CreateDepartmentDto
  ): Promise<DepartmentDto> => {
    const response = await apiClient.post<DepartmentDto>(
      `/companies/${companyId}/branches/${branchId}/departments`,
      dto
    );
    return response.data;
  },

  listDepartments: async (
    companyId: string,
    branchId: string,
    query?: ListDepartmentsQueryDto
  ): Promise<PaginatedResponse<DepartmentDto>> => {
    const response = await apiClient.get<PaginatedResponse<DepartmentDto>>(
      `/companies/${companyId}/branches/${branchId}/departments`,
      { params: query }
    );
    return response.data;
  },

  getDepartmentTree: async (
    companyId: string,
    branchId: string
  ): Promise<DepartmentTreeNode[]> => {
    const response = await apiClient.get<DepartmentTreeNode[]>(
      `/companies/${companyId}/branches/${branchId}/departments/tree`
    );
    return response.data;
  },

  getDepartment: async (
    companyId: string,
    branchId: string,
    id: string
  ): Promise<DepartmentDto> => {
    const response = await apiClient.get<DepartmentDto>(
      `/companies/${companyId}/branches/${branchId}/departments/${id}`
    );
    return response.data;
  },

  updateDepartment: async (
    companyId: string,
    branchId: string,
    id: string,
    dto: UpdateDepartmentDto
  ): Promise<DepartmentDto> => {
    const response = await apiClient.patch<DepartmentDto>(
      `/companies/${companyId}/branches/${branchId}/departments/${id}`,
      dto
    );
    return response.data;
  },

  deleteDepartment: async (
    companyId: string,
    branchId: string,
    id: string
  ): Promise<DepartmentDto> => {
    const response = await apiClient.delete<DepartmentDto>(
      `/companies/${companyId}/branches/${branchId}/departments/${id}`
    );
    return response.data;
  },

  restoreDepartment: async (
    companyId: string,
    branchId: string,
    id: string
  ): Promise<DepartmentDto> => {
    const response = await apiClient.post<DepartmentDto>(
      `/companies/${companyId}/branches/${branchId}/departments/${id}/restore`
    );
    return response.data;
  },
};
