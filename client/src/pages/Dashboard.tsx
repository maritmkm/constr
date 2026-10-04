import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  Users,
  UserCheck,
  Briefcase,
  CheckCircle,
  UserCheck2,
  Plus,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingState } from '../components/common/LoadingState';
import { AssignProjectWizard } from '../components/ongoing-work/AssignProjectWizard';
import { CompanyFormModal } from '../components/company/CompanyFormModal';
import { EmployeeFormModal } from '../components/employee/EmployeeFormModal';
import { LocationModal } from '../components/master/LocationModal';
import { JobTypeModal } from '../components/master/JobTypeModal';
import { dashboardService } from '../services/dashboard.service';
import { locationService } from '../services/location.service';
import { jobTypeService } from '../services/jobType.service';
import { companyService } from '../services/company.service';
import { employeeService } from '../services/employee.service';
import { formatDate } from '../lib/dateUtils';
import { toast } from 'sonner';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Modal states for Quick Actions
  const [assignWorkOpen, setAssignWorkOpen] = useState(false);
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const [addJobTypeOpen, setAddJobTypeOpen] = useState(false);

  // Queries
  const { data: summaryData, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const res = await dashboardService.getSummary();
      return res.data;
    },
  });

  const { data: locationsData } = useQuery({
    queryKey: ['locations-list'],
    queryFn: async () => {
      const res = await locationService.getAll({ limit: 100 });
      return res.data;
    },
  });

  const { data: jobTypesData } = useQuery({
    queryKey: ['job-types-list'],
    queryFn: async () => {
      const res = await jobTypeService.getAll({ limit: 100 });
      return res.data;
    },
  });

  if (isLoading || !summaryData) {
    return <LoadingState rows={8} />;
  }

  const { stats, activeWorks, recentCompanies, recentWorks } = summaryData;

  const statCards = [
    { title: 'Total Companies', value: stats.totalCompanies, icon: Building2, color: 'text-[#2872A1]', bg: 'bg-[#CBDDE9]/40', path: '/companies' },
    { title: 'Total Employees', value: stats.totalEmployees, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/employees' },
    { title: 'Active Employees', value: stats.activeEmployees, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/employees' },
    { title: 'Ongoing Works', value: stats.ongoingWorks, icon: Briefcase, color: 'text-[#2872A1]', bg: 'bg-sky-50', path: '/ongoing-works' },
    { title: 'Completed Works', value: stats.completedWorks, icon: CheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-50', path: '/ongoing-works' },
    { title: 'Available Employees', value: stats.availableEmployees, icon: UserCheck2, color: 'text-purple-600', bg: 'bg-purple-50', path: '/employees' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Workforce Dashboard"
        description="Comprehensive operational summary of ongoing projects, companies, and deployed personnel."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card
              key={idx}
              className="cursor-pointer hover:-translate-y-1 transition-all"
              onClick={() => navigate(card.path)}
            >
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-extrabold text-[#172B3A]">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <Card className="bg-gradient-to-r from-[#172B3A] to-[#2872A1] text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Quick Operations</h3>
              <p className="text-xs text-[#CBDDE9] mt-0.5">Rapidly create companies, deploy workforce, or update master records.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="sky"
                size="sm"
                className="font-bold shadow-xs"
                onClick={() => setAssignWorkOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" /> Create Work
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={() => setAddCompanyOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Company
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={() => setAddEmployeeOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Employee
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={() => setAddJobTypeOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Job Type
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={() => setAddLocationOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Work Summary Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div>
            <CardTitle>Active Work Summary</CardTitle>
            <CardDescription>Currently ongoing and upcoming project deployments</CardDescription>
          </div>
          <Link to="/ongoing-works" className="text-xs font-bold text-[#2872A1] hover:underline flex items-center gap-1">
            View All Works <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card List View */}
          <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
            {activeWorks.length > 0 ? (
              activeWorks.map((work: any) => (
                <div key={work._id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-[#172B3A] text-sm">{work.company}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{work.location}</p>
                    </div>
                    <StatusBadge status={work.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Start Date</span>
                      <span className="font-semibold text-slate-700">{formatDate(work.startDate)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">End Date</span>
                      <span className="font-semibold text-slate-700">{formatDate(work.endDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-600 font-medium">
                      Personnel: <strong className="text-[#2872A1]">{work.assignedEmployeesCount}</strong>
                    </span>
                    <span className="font-bold text-slate-800">{work.durationDays} Days</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-6 text-sm">
                No active works currently running.
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned Workforce</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeWorks.length > 0 ? (
                  activeWorks.map((work: any) => (
                    <TableRow key={work._id} className="hover:bg-sky-50/30">
                      <TableCell className="font-bold text-slate-900">{work.company}</TableCell>
                      <TableCell className="text-xs text-slate-600">{work.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[#2872A1]">{work.assignedEmployeesCount}</span>
                          <span className="text-xs text-slate-500">
                            ({work.assignedEmployeeNames.join(', ')}
                            {work.assignedEmployeesCount > 3 ? '...' : ''})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">{formatDate(work.startDate)}</TableCell>
                      <TableCell className="text-xs text-slate-600">{formatDate(work.endDate)}</TableCell>
                      <TableCell className="text-xs font-bold text-slate-800">{work.durationDays} Days</TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={work.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                      No active works currently running.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Grids: Recent Companies & Recent Works */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Companies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle>Recent Companies</CardTitle>
            <Link to="/companies" className="text-xs font-bold text-[#2872A1] hover:underline flex items-center gap-1">
              All Companies <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentCompanies.map((c: any) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/companies/${c._id}`)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#CBDDE9]/50 text-[#172B3A] flex items-center justify-center font-bold text-sm">
                      {c.companyName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#172B3A]">{c.companyName}</p>
                      <p className="text-xs text-slate-500">{c.companyType} • Owner: {c.ownerName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    {c.location}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Works */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle>Recent Works</CardTitle>
            <Link to="/ongoing-works" className="text-xs font-bold text-[#2872A1] hover:underline flex items-center gap-1">
              All Works <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentWorks.map((w: any) => (
                <div key={w._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-[#172B3A]">{w.company}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{w.location}</span>
                      <span>•</span>
                      <span>{w.employeeCount} Personnel</span>
                    </div>
                  </div>
                  <StatusBadge status={w.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals for Quick Actions */}
      <AssignProjectWizard
        isOpen={assignWorkOpen}
        onClose={() => setAssignWorkOpen(false)}
        locations={locationsData || []}
        jobTypes={jobTypesData || []}
        onSuccess={refetch}
      />

      <CompanyFormModal
        isOpen={addCompanyOpen}
        onClose={() => setAddCompanyOpen(false)}
        locations={locationsData || []}
        onSubmit={async (fd) => {
          await companyService.create(fd);
          toast.success('Company created!');
          refetch();
        }}
      />

      <EmployeeFormModal
        isOpen={addEmployeeOpen}
        onClose={() => setAddEmployeeOpen(false)}
        locations={locationsData || []}
        jobTypes={jobTypesData || []}
        onSubmit={async (data) => {
          await employeeService.create(data);
          toast.success('Employee created!');
          refetch();
        }}
      />

      <LocationModal
        isOpen={addLocationOpen}
        onClose={() => setAddLocationOpen(false)}
        onSubmit={async (data) => {
          await locationService.create(data);
          toast.success('Location created!');
          refetch();
        }}
      />

      <JobTypeModal
        isOpen={addJobTypeOpen}
        onClose={() => setAddJobTypeOpen(false)}
        onSubmit={async (data) => {
          await jobTypeService.create(data);
          toast.success('Job type created!');
          refetch();
        }}
      />
    </div>
  );
};
