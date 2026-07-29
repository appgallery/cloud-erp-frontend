import { api } from '@/lib/api/client';

export interface LoginRequest {
  email: string;
  password: string;
}

export const authApi = {
  login: async (payload: LoginRequest) => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  me: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },
};