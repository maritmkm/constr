import { api } from './api';
import { ApiResponse, Employee, EmployeeStatus } from '../types';

export const employeeService = {
  getAll: async (params?: {
    search?: string;
    locationId?: string;
    jobTypeId?: string;
    status?: EmployeeStatus;
    page?: number;
    limit?: number;
  }) => {
    const res = await api.get<ApiResponse<Employee[]>>('/employees', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
    return res.data;
  },

  create: async (data: {
    name: string;
    phoneNumber: string;
    locationId: string;
    address: string;
    alternativePhoneNumber?: string;
    status: EmployeeStatus;
    jobTypeId: string;
  }) => {
    const res = await api.post<ApiResponse<Employee>>('/employees', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Employee>) => {
    const res = await api.patch<ApiResponse<Employee>>(`/employees/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<ApiResponse<any>>(`/employees/${id}`);
    return res.data;
  },

  getPublicOptions: async () => {
    const res = await api.get<ApiResponse<{ locations: any[]; jobTypes: any[] }>>('/public/options');
    return res.data;
  },

  publicRegister: async (data: {
    name: string;
    phoneNumber: string;
    locationId: string;
    address: string;
    alternativePhoneNumber?: string;
    jobTypeId: string;
  }) => {
    const res = await api.post<ApiResponse<Employee>>('/public/register-employee', data);
    return res.data;
  },

  bulkImport: async (employees: any[]) => {
    const res = await api.post<ApiResponse<any>>('/employees/bulk-import', { employees });
    return res.data;
  },
};
