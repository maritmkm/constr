import { api } from './api';
import { ApiResponse, Company, CompanyDetailStats, OngoingWork } from '../types';

export const companyService = {
  getAll: async (params?: { search?: string; locationId?: string; page?: number; limit?: number }) => {
    const res = await api.get<ApiResponse<Company[]>>('/companies', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<{ company: Company; stats: CompanyDetailStats }>>(`/companies/${id}`);
    return res.data;
  },

  getWorkHistory: async (id: string, params?: { page?: number; limit?: number }) => {
    const res = await api.get<ApiResponse<OngoingWork[]>>(`/companies/${id}/work-history`, { params });
    return res.data;
  },

  create: async (formData: FormData) => {
    const res = await api.post<ApiResponse<Company>>('/companies', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  update: async (id: string, formData: FormData) => {
    const res = await api.patch<ApiResponse<Company>>(`/companies/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<any>>(`/companies/${id}`);
    return res.data;
  },
};
