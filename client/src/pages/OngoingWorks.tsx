import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Eye, CheckCircle2, XCircle, Trash2, MapPin, Users, Calendar } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { SearchInput } from '../components/common/SearchInput';
import { Select } from '../components/ui/select';
import { Tabs } from '../components/ui/tabs';
import { StatusBadge } from '../components/common/StatusBadge';
import { Pagination } from '../components/ui/pagination';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { AssignProjectWizard } from '../components/ongoing-work/AssignProjectWizard';
import { WorkDetailModal } from '../components/ongoing-work/WorkDetailModal';
import { ongoingWorkService } from '../services/ongoingWork.service';
import { locationService } from '../services/location.service';
import { jobTypeService } from '../services/jobType.service';
import { OngoingWork, WorkStatus } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { formatDate } from '../lib/dateUtils';
import { toast } from 'sonner';

export const OngoingWorks: React.FC = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [activeTab, setActiveTab] = useState<string>('ONGOING');
  const [page, setPage] = useState(1);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<OngoingWork | null>(null);

  // Action Dialog states
  const [completeId, setCompleteId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries
  const { data: worksData, isLoading, refetch } = useQuery({
    queryKey: ['ongoing-works', debouncedSearch, locationFilter, jobTypeFilter, activeTab, page],
    queryFn: async () => {
      const res = await ongoingWorkService.getAll({
        search: debouncedSearch,
        locationId: locationFilter,
        jobTypeId: jobTypeFilter,
        status: activeTab as any,
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
  const completeMutation = useMutation({
    mutationFn: (id: string) => ongoingWorkService.completeWork(id),
    onSuccess: () => {
      toast.success('Project work marked as completed');
      queryClient.invalidateQueries({ queryKey: ['ongoing-works'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      setCompleteId(null);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => ongoingWorkService.cancelWork(id),
    onSuccess: () => {
      toast.success('Project work cancelled');
      queryClient.invalidateQueries({ queryKey: ['ongoing-works'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      setCancelId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ongoingWorkService.delete(id),
    onSuccess: () => {
      toast.success('Work deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['ongoing-works'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      setDeleteId(null);
    },
  });

  const locations = locationsData || [];
  const jobTypes = jobTypesData || [];
  const works = worksData?.data || [];
  const pagination = worksData?.pagination;

  const tabs = [
    { id: 'ONGOING', label: 'Ongoing Works' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'ALL', label: 'All Works' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Work Assignments"
        description="Monitor ongoing site deployments, assign workforce, and track overall duration."
        action={
          <Button variant="primary" onClick={() => setWizardOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Assign Project
          </Button>
        }
      />

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tabId) => {
          setActiveTab(tabId);
          setPage(1);
        }}
      />

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <SearchInput
          placeholder="Search company or employee name..."
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          className="w-full"
        />

        <Select
          options={[
            { label: 'All Locations', value: '' },
            ...locations.map((l) => ({ label: l.name, value: l._id })),
          ]}
          value={locationFilter}
          onChange={(e) => {
            setLocationFilter(e.target.value);
            setPage(1);
          }}
        />

        <Select
          options={[
            { label: 'All Job Types / Trades', value: '' },
            ...jobTypes.map((j) => ({ label: j.name, value: j._id })),
          ]}
          value={jobTypeFilter}
          onChange={(e) => {
            setJobTypeFilter(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table / List */}
      {isLoading ? (
        <LoadingState rows={6} />
      ) : works.length > 0 ? (
        <div className="space-y-4">
          {/* Mobile Card List View (< md) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {works.map((work) => {
              const compName = typeof work.company === 'object' ? work.company?.companyName : 'Company';
              const locName = typeof work.location === 'object' ? work.location?.name : 'Location';

              return (
                <div
                  key={work._id}
                  onClick={() => setSelectedWork(work)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 cursor-pointer hover:border-[#2872A1] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#172B3A]">{compName}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{locName}</span>
                      </div>
                    </div>
                    <StatusBadge status={work.status} />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="font-bold text-[#2872A1] bg-sky-50 px-2.5 py-0.5 rounded-full text-xs">
                      {work.employeeCount || work.employees?.length || 0} Personnel
                    </span>
                    <span className="font-extrabold text-slate-800">
                      {work.durationDays} Days Duration
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Start Date</span>
                      <span className="font-medium">{formatDate(work.overallStartDate)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">End Date</span>
                      <span className="font-medium">{formatDate(work.overallEndDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setSelectedWork(work)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View Details
                    </Button>
                    {work.status === 'ONGOING' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                          onClick={() => setCompleteId(work._id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                          onClick={() => setCancelId(work._id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteId(work._id)}
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
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned Workforce</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {works.map((work) => {
                  const compName = typeof work.company === 'object' ? work.company?.companyName : 'Company';
                  const locName = typeof work.location === 'object' ? work.location?.name : 'Location';

                  return (
                    <TableRow
                      key={work._id}
                      className="cursor-pointer hover:bg-sky-50/30"
                      onClick={() => setSelectedWork(work)}
                    >
                      <TableCell className="font-bold text-[#172B3A]">{compName}</TableCell>
                      <TableCell className="text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{locName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2872A1] bg-sky-50 px-2 py-0.5 rounded-full text-xs">
                            {work.employeeCount || work.employees?.length || 0} Personnel
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">{formatDate(work.overallStartDate)}</TableCell>
                      <TableCell className="text-xs text-slate-600">{formatDate(work.overallEndDate)}</TableCell>
                      <TableCell className="text-xs font-bold text-slate-800">
                        {work.durationDays} Days
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={work.status} />
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Work Details"
                            onClick={() => setSelectedWork(work)}
                          >
                            <Eye className="h-4 w-4 text-[#2872A1]" />
                          </Button>

                          {work.status === 'ONGOING' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Mark as Completed"
                                onClick={() => setCompleteId(work._id)}
                              >
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Cancel Work"
                                onClick={() => setCancelId(work._id)}
                              >
                                <XCircle className="h-4 w-4 text-amber-600" />
                              </Button>
                            </>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Record"
                            onClick={() => setDeleteId(work._id)}
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
          title="No ongoing works found"
          description="Click Assign Project to assign skilled workforce to client sites."
          actionLabel="Assign Project"
          onAction={() => setWizardOpen(true)}
        />
      )}

      {/* Guided Wizard Sheet */}
      <AssignProjectWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        locations={locations}
        jobTypes={jobTypes}
        onSuccess={refetch}
      />

      {/* Work Detail Modal */}
      <WorkDetailModal
        isOpen={!!selectedWork}
        onClose={() => setSelectedWork(null)}
        work={selectedWork}
      />

      {/* Complete Confirmation */}
      <ConfirmDialog
        isOpen={!!completeId}
        onClose={() => setCompleteId(null)}
        onConfirm={() => completeId && completeMutation.mutate(completeId)}
        title="Complete Project Work"
        description="Mark this ongoing project as completed? Completed works will be archived to the client company's work history."
        confirmText="Mark Completed"
        variant="primary"
        isLoading={completeMutation.isPending}
      />

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={() => cancelId && cancelMutation.mutate(cancelId)}
        title="Cancel Project Assignment"
        description="Are you sure you want to cancel this ongoing work assignment?"
        confirmText="Cancel Work"
        variant="danger"
        isLoading={cancelMutation.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Work Assignment"
        description="Are you sure you want to delete this work assignment record?"
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
