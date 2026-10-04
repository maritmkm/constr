import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  MapPin,
  User,
  Phone,
  Edit,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock,
  Users,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoadingState } from '../components/common/LoadingState';
import { CompanyFormModal } from '../components/company/CompanyFormModal';
import { CompanyWorkHistoryTable } from '../components/company/CompanyWorkHistoryTable';
import { Pagination } from '../components/ui/pagination';
import { companyService } from '../services/company.service';
import { locationService } from '../services/location.service';
import { toast } from 'sonner';

export const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);

  // Fetch Company Details
  const { data: detailsData, isLoading: loadingDetails, refetch: refetchDetails } = useQuery({
    queryKey: ['company-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID');
      const res = await companyService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch Work History
  const { data: historyData, isLoading: loadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['company-history', id, historyPage],
    queryFn: async () => {
      if (!id) throw new Error('No ID');
      const res = await companyService.getWorkHistory(id, { page: historyPage, limit: 10 });
      return res;
    },
    enabled: !!id,
  });

  const { data: locationsData } = useQuery({
    queryKey: ['locations-select'],
    queryFn: async () => {
      const res = await locationService.getAll({ limit: 100 });
      return res.data;
    },
  });

  if (loadingDetails || !detailsData) {
    return <LoadingState rows={8} />;
  }

  const { company, stats } = detailsData;
  const historyWorks = historyData?.data || [];
  const historyPagination = historyData?.pagination;
  const locName = typeof company.locationId === 'object' ? company.locationId?.name : 'Location';

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate('/companies')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Companies
        </Button>

        <Button variant="primary" size="sm" onClick={() => setEditModalOpen(true)}>
          <Edit className="h-4 w-4 mr-1" /> Edit Company Profile
        </Button>
      </div>

      {/* Header Profile Banner */}
      <Card className="bg-gradient-to-r from-[#172B3A] via-[#1D3B50] to-[#2872A1] text-white overflow-hidden shadow-lg border-0">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="h-24 w-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden flex items-center justify-center font-extrabold text-3xl shrink-0 text-white shadow-xl">
            {company.profileImage ? (
              <img src={company.profileImage} alt={company.companyName} className="h-full w-full object-cover" />
            ) : (
              company.companyName.charAt(0)
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{company.companyName}</h1>
            <p className="text-sm text-[#CBDDE9] font-medium mt-1">{company.companyType}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <MapPin className="h-3.5 w-3.5 text-[#CBDDE9]" /> {locName}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <User className="h-3.5 w-3.5 text-[#CBDDE9]" /> Owner: {company.ownerName}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <Phone className="h-3.5 w-3.5 text-[#CBDDE9]" /> {company.phoneNumber}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-sky-50 text-[#2872A1]">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Works</p>
              <p className="text-2xl font-extrabold text-[#172B3A]">{stats.totalWorks}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#CBDDE9]/60 text-[#172B3A]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ongoing Works</p>
              <p className="text-2xl font-extrabold text-[#2872A1]">{stats.ongoingWorks}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Works</p>
              <p className="text-2xl font-extrabold text-emerald-700">{stats.completedWorks}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Employees</p>
              <p className="text-2xl font-extrabold text-purple-700">{stats.totalEmployeesAssigned}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Info Card */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-500">Address:</span>
            <p className="font-medium text-slate-800 mt-0.5">{company.address}</p>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Alternative Phone:</span>
            <p className="font-medium text-slate-800 mt-0.5">{company.alternativePhoneNumber || 'None'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Work History Section */}
      <Card>
        <CardHeader className="py-4 flex flex-row items-center justify-between">
          <CardTitle>Work History & Projects</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingHistory ? (
            <LoadingState rows={4} />
          ) : historyWorks.length > 0 ? (
            <div>
              <CompanyWorkHistoryTable works={historyWorks} />
              {historyPagination && (
                <div className="p-2">
                  <Pagination meta={historyPagination} onPageChange={setHistoryPage} />
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs font-medium">
              No project work history recorded for this company yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Company Modal */}
      <CompanyFormModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        company={company}
        locations={locationsData || []}
        onSubmit={async (fd) => {
          await companyService.update(company._id, fd);
          toast.success('Company profile updated successfully');
          refetchDetails();
          refetchHistory();
        }}
      />
    </div>
  );
};
