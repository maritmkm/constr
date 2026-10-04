export interface User {
  id: string;
  name: string;
  email: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  pagination?: PaginationMeta;
  errors?: string[];
}

export interface Location {
  _id: string;
  name: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobType {
  _id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  _id: string;
  companyName: string;
  companyType: string;
  locationId: Location | string;
  ownerName: string;
  address: string;
  phoneNumber: string;
  alternativePhoneNumber?: string;
  profileImage?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyDetailStats {
  totalWorks: number;
  ongoingWorks: number;
  completedWorks: number;
  totalEmployeesAssigned: number;
}

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

export interface ActiveAssignment {
  workId: string;
  companyId: string;
  companyName: string;
  startDate: string;
  endDate: string;
  status?: string;
}

export interface Employee {
  _id: string;
  name: string;
  phoneNumber: string;
  locationId: Location | string;
  address: string;
  alternativePhoneNumber?: string;
  status: EmployeeStatus;
  jobTypeId: JobType | string;
  currentWork?: string;
  currentWorkId?: string;
  currentWorkStartDate?: string;
  currentWorkEndDate?: string;
  activeAssignments?: ActiveAssignment[];
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type WorkStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface AssignedEmployeeItem {
  employeeId: Employee | string;
  jobTypeId: JobType | string;
  employeeName?: string;
  jobType?: string;
  jobTypeName?: string;
  startDate: string;
  endDate: string;
  workingDays?: number;
  assignedAt?: string;
}

export interface OngoingWork {
  _id: string;
  company: Company | any;
  location: Location | any;
  overallStartDate: string;
  overallEndDate: string;
  durationDays?: number;
  totalDurationDays?: number;
  status: WorkStatus;
  employeeCount: number;
  employees: AssignedEmployeeItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardSummary {
  stats: {
    totalCompanies: number;
    totalEmployees: number;
    activeEmployees: number;
    ongoingWorks: number;
    completedWorks: number;
    availableEmployees: number;
  };
  activeWorks: Array<{
    _id: string;
    company: string;
    companyProfile?: string;
    location: string;
    assignedEmployeesCount: number;
    assignedEmployeeNames: string[];
    startDate: string;
    endDate: string;
    durationDays: number;
    status: WorkStatus;
  }>;
  recentCompanies: Array<{
    _id: string;
    companyName: string;
    companyType: string;
    ownerName: string;
    location: string;
    profileImage?: string;
    createdAt: string;
  }>;
  recentWorks: Array<{
    _id: string;
    company: string;
    location: string;
    employeeCount: number;
    status: WorkStatus;
    createdAt: string;
  }>;
}
