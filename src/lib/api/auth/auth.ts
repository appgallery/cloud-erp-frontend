import { client } from '../client';
import {
  LoginDto,
  SignupDto,
  RefreshDto,
  TokenPair,
  SignupResponse,
  Company,
} from '../types';

export const authApi = {
  login: async (data: LoginDto): Promise<TokenPair> => {
    const response = await client.post<TokenPair>('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupDto): Promise<SignupResponse> => {
    const response = await client.post<SignupResponse>('/auth/signup', data);
    return response.data;
  },

  refresh: async (data: RefreshDto): Promise<TokenPair> => {
    const response = await client.post<TokenPair>('/auth/refresh', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await client.post('/auth/logout');
  },

  getMyCompanies: async (): Promise<Company[]> => {
    const response = await client.get<Company[]>('/me/companies');
    return response.data;
  },
};
