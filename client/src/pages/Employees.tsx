import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Phone, MapPin, Wrench } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { SearchInput } from '../components/common/SearchInput';
import { Select } from '../components/ui/select';
import { StatusBadge } from '../components/common/StatusBadge';
import { Pagination } from '../components/ui/pagination';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmployeeFormModal } from '../components/employee/EmployeeFormModal';
import { employeeService } from '../services/employee.service';
import { locationService } from '../services/location.service';
import { jobTypeService } from '../services/jobType.service';
import { Employee, EmployeeStatus } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { toast } from 'sonner';

export const Employees: React.FC = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries
  const { data: employeesData, isLoading } = useQuery({
    queryKey: ['employees', debouncedSearch, locationFilter, jobTypeFilter, statusFilter, page],
    queryFn: async () => {
      const res = await employeeService.getAll({
        search: debouncedSearch,
        locationId: locationFilter,
        jobTypeId: jobTypeFilter,
        status: statusFilter as EmployeeStatus,
        page,
        limit: 10,
      });
      return res;
    },
  });

  const { data: locationsData } = useQuery({
    queryKey: ['locations-select'],
    queryFn: async () => {
      const res = await locationService.getAll({ limit: 100 });
      return res.data;
    },
  });

  const { data: jobTypesData } = useQuery({
    queryKey: ['job-types-select'],
    queryFn: async () => {
      const res = await jobTypeService.getAll({ limit: 100 });
      return res.data;
    },
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: () => {
      toast.success('Employee deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete employee');
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingEmployee) {
        return employeeService.update(editingEmployee._id, data);
      } else {
        return employeeService.create(data);
      }
    },
    onSuccess: () => {
      toast.success(editingEmployee ? 'Employee updated!' : 'Employee created!');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setModalOpen(false);
      setEditingEmployee(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save employee');
    },
  });

  const locations = locationsData || [];
  const jobTypes = jobTypesData || [];
  const employees = employeesData?.data || [];
  const pagination = employeesData?.pagination;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Directory"
        description="Manage skilled workforce, trades, availability status, and location deployments."
        action={
          <Button
            variant="primary"
            onClick={() => {
              setEditingEmployee(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Employee
          </Button>
        }
      />

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <SearchInput
          placeholder="Search by name or phone..."
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          className="w-full"
        />

        <Select
          options={[
            { label: 'All Job Types', value: '' },
            ...jobTypes.map((j: any) => ({ label: j.name, value: j._id })),
          ]}
          value={jobTypeFilter}
          onChange={(e) => {
            setJobTypeFilter(e.target.value);
            setPage(1);
          }}
        />

        <Select
          options={[
            { label: 'All Locations', value: '' },
            ...locations.map((l: any) => ({ label: l.name, value: l._id })),
          ]}
          value={locationFilter}
          onChange={(e) => {
            setLocationFilter(e.target.value);
            setPage(1);
          }}
        />

        <Select
          options={[
            { label: 'All Statuses', value: '' },
            { label: 'ACTIVE', value: 'ACTIVE' },
            { label: 'INACTIVE', value: 'INACTIVE' },
            { label: 'ON LEAVE', value: 'ON_LEAVE' },
          ]}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table / List */}
      {isLoading ? (
        <LoadingState rows={6} />
      ) : employees.length > 0 ? (
        <div className="space-y-4">
          {/* Mobile Card List View (< md) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {employees.map((emp: any) => {
              const jtName = typeof emp.jobTypeId === 'object' ? emp.jobTypeId?.name : 'Trade';
              const locName = typeof emp.locationId === 'object' ? emp.locationId?.name : 'Location';

              return (
                <div
                  key={emp._id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#172B3A]">{emp.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{emp.address}</p>
                    </div>
                    <StatusBadge status={emp.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#CBDDE9]/60 text-[#172B3A]">
                      {jtName}
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {emp.currentWork || 'Available'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{emp.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{locName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        setEditingEmployee(emp);
                        setModalOpen(true);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteId(emp._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Job Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Work</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp: any) => {
                  const jtName = typeof emp.jobTypeId === 'object' ? emp.jobTypeId?.name : 'Trade';
                  const locName = typeof emp.locationId === 'object' ? emp.locationId?.name : 'Location';

                  return (
                    <TableRow key={emp._id} className="hover:bg-sky-50/30">
                      <TableCell className="font-bold text-[#172B3A]">
                        <div>
                          <p className="text-sm font-bold">{emp.name}</p>
                          <p className="text-[11px] text-slate-400">{emp.address}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{emp.phoneNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#CBDDE9]/60 text-[#172B3A]">
                          {jtName}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{locName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={emp.status} />
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-700">
                        {emp.currentWork || 'Available'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit Employee"
                            onClick={() => {
                              setEditingEmployee(emp);
                              setModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Employee"
                            onClick={() => setDeleteId(emp._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
        </div>
      ) : (
        <EmptyState
          title="No employees found"
          description={
            search || locationFilter || jobTypeFilter || statusFilter
              ? 'No employees match your current filter selection.'
              : 'Add your first employee to start building your workforce database.'
          }
          actionLabel="Add Employee"
          onAction={() => {
            setEditingEmployee(null);
            setModalOpen(true);
          }}
        />
      )}

      {/* Employee Modal */}
      <EmployeeFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEmployee(null);
        }}
        employee={editingEmployee}
        locations={locations}
        jobTypes={jobTypes}
        onSubmit={async (data) => {
          await saveMutation.mutateAsync(data);
        }}
        isLoading={saveMutation.isPending}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Employee"
        description="Are you sure you want to delete this employee? Deletion will fail if the employee is currently assigned to an ongoing project."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
