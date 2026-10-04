import { api } from './api';
import { ApiResponse, User } from '../types';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', credentials);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },

  logout: async () => {
    const res = await api.post<ApiResponse<null>>('/auth/logout');
    return res.data;
  },
};
