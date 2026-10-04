import { api } from './api';
import { ApiResponse, JobType } from '../types';

export const jobTypeService = {
  getAll: async (params?: { search?: string; page?: number; limit?: number }) => {
    const res = await api.get<ApiResponse<JobType[]>>('/job-types', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<JobType>>(`/job-types/${id}`);
    return res.data;
  },

  create: async (data: { name: string; description?: string; status?: 'ACTIVE' | 'INACTIVE' }) => {
    const res = await api.post<ApiResponse<JobType>>('/job-types', data);
    return res.data;
  },

  update: async (id: string, data: { name?: string; description?: string; status?: 'ACTIVE' | 'INACTIVE' }) => {
    const res = await api.patch<ApiResponse<JobType>>(`/job-types/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<any>>(`/job-types/${id}`);
    return res.data;
  },
};
