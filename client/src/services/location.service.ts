import { api } from './api';
import { ApiResponse, Location } from '../types';

export const locationService = {
  getAll: async (params?: { search?: string; page?: number; limit?: number }) => {
    const res = await api.get<ApiResponse<Location[]>>('/locations', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Location>>(`/locations/${id}`);
    return res.data;
  },

  create: async (data: { name: string }) => {
    const res = await api.post<ApiResponse<Location>>('/locations', data);
    return res.data;
  },

  update: async (id: string, data: { name: string }) => {
    const res = await api.patch<ApiResponse<Location>>(`/locations/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<any>>(`/locations/${id}`);
    return res.data;
  },
};
