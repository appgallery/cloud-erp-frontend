import { apiClient } from '../baseApicall';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    organizationName: string;
    companyName: string;
    role: string;
  };
}
export const authApi = {
  login: async (data: Record<string, any>) => {
    const response = await apiClient.post<AuthResponse>(`/auth/login`, data);
    return response.data;
  },
  
  register: async (data: Record<string, any>) => {
    const response = await apiClient.post<AuthResponse>(`/auth/signup`, data);
    return response.data;
  },

  sendOtp: async (email: string) => {
    const response = await apiClient.post(`/auth/forgot-password/send-otp`, { email });
    return response.data;
  },

  verifyOtp: async (data: { email: string; otp: string }) => {
    const response = await apiClient.post<{ resetToken: string }>(`/auth/forgot-password/verify-otp`, data);
    return response.data;
  },

  resetPassword: async (data: Record<string, any>) => {
    const response = await apiClient.post(`/auth/forgot-password/reset`, data);
    return response.data;
  }
};
