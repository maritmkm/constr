import { api } from './api';
import { ApiResponse, OngoingWork, WorkStatus } from '../types';

export interface CreateWorkPayload {
  companyId: string;
  locationId: string;
  overallStartDate: string;
  overallEndDate: string;
  employees: Array<{
    employeeId: string;
    jobTypeId: string;
    startDate: string;
    endDate: string;
  }>;
}

export const ongoingWorkService = {
  getAll: async (params?: {
    search?: string;
    locationId?: string;
    jobTypeId?: string;
    status?: WorkStatus | 'ALL';
    page?: number;
    limit?: number;
  }) => {
    const res = await api.get<ApiResponse<OngoingWork[]>>('/ongoing-works', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<OngoingWork>>(`/ongoing-works/${id}`);
    return res.data;
  },

  create: async (data: CreateWorkPayload) => {
    const res = await api.post<ApiResponse<OngoingWork>>('/ongoing-works', data);
    return res.data;
  },

  completeWork: async (id: string) => {
    const res = await api.post<ApiResponse<any>>(`/ongoing-works/${id}/complete`);
    return res.data;
  },

  cancelWork: async (id: string) => {
    const res = await api.post<ApiResponse<any>>(`/ongoing-works/${id}/cancel`);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<any>>(`/ongoing-works/${id}`);
    return res.data;
  },
};
