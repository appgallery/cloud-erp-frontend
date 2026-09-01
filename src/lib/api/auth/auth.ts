import { client } from '../client';
import {
  LoginDto,
  SignupDto,
  RefreshDto,
  TokenPair,
  SignupResponse,
  MyCompanyEntry,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
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

  forgotPassword: async (data: ForgotPasswordDto): Promise<void> => {
    await client.post('/auth/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordDto): Promise<void> => {
    await client.post('/auth/reset-password', data);
  },

  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await client.post('/auth/change-password', data);
  },

  getMyCompanies: async (): Promise<MyCompanyEntry[]> => {
    const response = await client.get<MyCompanyEntry[]>('/me/companies');
    return response.data;
  },
};
