import { apiClient } from '../baseApicall';
import {
  BranchDto,
  CreateBranchDto,
  UpdateBranchDto,
  ListBranchesQueryDto,
  PaginatedResponse,
} from '../types';

export const branchesApi = {
  listBranches: async (
    companyId: string,
    query?: ListBranchesQueryDto
  ): Promise<PaginatedResponse<BranchDto>> => {
    const response = await apiClient.get<PaginatedResponse<BranchDto>>(
      `/companies/${companyId}/branches`,
      { params: query }
    );
    return response.data;
  },

  createBranch: async (companyId: string, dto: CreateBranchDto): Promise<BranchDto> => {
    const response = await apiClient.post<BranchDto>(
      `/companies/${companyId}/branches`,
      dto
    );
    return response.data;
  },

  getBranch: async (companyId: string, id: string): Promise<BranchDto> => {
    const response = await apiClient.get<BranchDto>(
      `/companies/${companyId}/branches/${id}`
    );
    return response.data;
  },

  updateBranch: async (
    companyId: string,
    id: string,
    dto: UpdateBranchDto
  ): Promise<BranchDto> => {
    const response = await apiClient.patch<BranchDto>(
      `/companies/${companyId}/branches/${id}`,
      dto
    );
    return response.data;
  },

  activateBranch: async (companyId: string, id: string): Promise<BranchDto> => {
    const response = await apiClient.patch<BranchDto>(
      `/companies/${companyId}/branches/${id}/activate`
    );
    return response.data;
  },

  deactivateBranch: async (companyId: string, id: string): Promise<BranchDto> => {
    const response = await apiClient.patch<BranchDto>(
      `/companies/${companyId}/branches/${id}/deactivate`
    );
    return response.data;
  },
};
