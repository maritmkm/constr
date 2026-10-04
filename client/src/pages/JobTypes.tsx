import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Wrench } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { SearchInput } from '../components/common/SearchInput';
import { StatusBadge } from '../components/common/StatusBadge';
import { Pagination } from '../components/ui/pagination';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { JobTypeModal } from '../components/master/JobTypeModal';
import { jobTypeService } from '../services/jobType.service';
import { JobType } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { formatDate } from '../lib/dateUtils';
import { toast } from 'sonner';

export const JobTypes: React.FC = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingJobType, setEditingJobType] = useState<JobType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: jobTypesData, isLoading } = useQuery({
    queryKey: ['job-types', debouncedSearch, page],
    queryFn: async () => {
      const res = await jobTypeService.getAll({
        search: debouncedSearch,
        page,
        limit: 10,
      });
      return res;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => jobTypeService.delete(id),
    onSuccess: () => {
      toast.success('Job type deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['job-types'] });
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete job type');
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingJobType) {
        return jobTypeService.update(editingJobType._id, data);
      } else {
        return jobTypeService.create(data);
      }
    },
    onSuccess: () => {
      toast.success(editingJobType ? 'Job type updated!' : 'Job type created!');
      queryClient.invalidateQueries({ queryKey: ['job-types'] });
      setModalOpen(false);
      setEditingJobType(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save job type');
    },
  });

  const jobTypes = jobTypesData?.data || [];
  const pagination = jobTypesData?.pagination;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Type Master"
        description="Configure skilled trades and job categories required for workforce deployment."
        action={
          <Button
            variant="primary"
            onClick={() => {
              setEditingJobType(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Job Type
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <SearchInput
          placeholder="Search job type or description..."
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <LoadingState rows={5} />
      ) : jobTypes.length > 0 ? (
        <div className="space-y-4">
          {/* Mobile Card List View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {jobTypes.map((job: any) => (
              <div key={job._id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-[#2872A1]" />
                    <span className="font-bold text-[#172B3A] text-sm">{job.name}</span>
                  </div>
                  <StatusBadge status={job.status} />
                </div>

                {job.description && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {job.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">Created: {formatDate(job.createdAt)}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingJobType(job);
                        setModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 text-slate-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setDeleteId(job._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Type / Trade</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobTypes.map((job: any) => (
                  <TableRow key={job._id} className="hover:bg-sky-50/30">
                    <TableCell className="font-bold text-[#172B3A]">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-[#2872A1]" />
                        <span>{job.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{job.description || '-'}</TableCell>
                    <TableCell>
                      <StatusBadge status={job.status} />
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{formatDate(job.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingJobType(job);
                            setModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(job._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination && <Pagination meta={pagination} onPageChange={setPage} />}
        </div>
      ) : (
        <EmptyState
          title="No job types found"
          description="Create master job types such as Electrician, Mechanic, Plumber, Welder."
          actionLabel="Add Job Type"
          onAction={() => {
            setEditingJobType(null);
            setModalOpen(true);
          }}
        />
      )}

      <JobTypeModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingJobType(null);
        }}
        jobType={editingJobType}
        onSubmit={async (data) => {
          await saveMutation.mutateAsync(data);
        }}
        isLoading={saveMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Job Type"
        description="Are you sure you want to delete this job type? If employees or works depend on it, it will be soft deleted."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
