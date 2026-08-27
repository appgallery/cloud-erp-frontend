import { apiClient } from '../baseApicall';
import {
  RegionDto,
  CreateRegionDto,
  UpdateRegionDto,
  ListRegionsQueryDto,
  RegionTreeNode,
  PaginatedResponse,
} from '../types';

export const regionsApi = {

  listRegions: async (
    companyId: string,
    query?: ListRegionsQueryDto
  ): Promise<PaginatedResponse<RegionDto>> => {
    const response = await apiClient.get<PaginatedResponse<RegionDto>>(
      `/companies/${companyId}/regions`,
      { params: query }
    );
    return response.data;
  },

  getRegionTree: async (companyId: string): Promise<RegionTreeNode[]> => {
    const response = await apiClient.get<RegionTreeNode[]>(
      `/companies/${companyId}/regions/tree`
    );
    return response.data;
  },

  createRegion: async (companyId: string, dto: CreateRegionDto): Promise<RegionDto> => {
    const response = await apiClient.post<RegionDto>(
      `/companies/${companyId}/regions`,
      dto
    );
    return response.data;
  },

  getRegion: async (companyId: string, id: string): Promise<RegionDto> => {
    const response = await apiClient.get<RegionDto>(
      `/companies/${companyId}/regions/${id}`
    );
    return response.data;
  },

  updateRegion: async (
    companyId: string,
    id: string,
    dto: UpdateRegionDto
  ): Promise<RegionDto> => {
    const response = await apiClient.patch<RegionDto>(
      `/companies/${companyId}/regions/${id}`,
      dto
    );
    return response.data;
  },
};
