import { client } from '../client';
import { PermissionItem } from '../types';

export const permissionsApi = {
  listPermissions: async (companyId: string): Promise<PermissionItem[]> => {
    const response = await client.get<PermissionItem[]>(
      `/companies/${companyId}/permissions`
    );
    return response.data;
  },
};
