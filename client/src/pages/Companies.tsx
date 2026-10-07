import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Eye, Edit, Trash2, Building2, MapPin, Phone, User, Download, Upload, FileSpreadsheet } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { SearchInput } from '../components/common/SearchInput';
import { Select } from '../components/ui/select';
import { Pagination } from '../components/ui/pagination';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { CompanyFormModal } from '../components/company/CompanyFormModal';
import { ImportModal } from '../components/common/ImportModal';
import { ExportModal } from '../components/common/ExportModal';
import { companyService } from '../services/company.service';
import { locationService } from '../services/location.service';
import { Company } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { formatDate } from '../lib/dateUtils';
import { exportDataToFile, ExportFormat } from '../lib/exportUtils';
import { toast } from 'sonner';

export const Companies: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [locationFilter, setLocationFilter] = useState('');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries
  const { data: companiesData, isLoading } = useQuery({
    queryKey: ['companies', debouncedSearch, locationFilter, page],
    queryFn: async () => {
      const res = await companyService.getAll({
        search: debouncedSearch,
        locationId: locationFilter,
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

  // Export handler
  const handleExport = (format: ExportFormat) => {
    if (!companies || companies.length === 0) {
      toast.error('No company data available to export.');
      return;
    }

    const exportData = companies.map((c: any) => ({
      companyName: c.companyName,
      companyType: c.companyType,
      locationName: typeof c.locationId === 'object' ? c.locationId?.name : '',
      ownerName: c.ownerName,
      phoneNumber: c.phoneNumber,
      alternativePhoneNumber: c.alternativePhoneNumber || '',
      address: c.address,
      createdAt: formatDate(c.createdAt),
    }));

    exportDataToFile(exportData, `Client_Companies_${new Date().toISOString().split('T')[0]}`, format, {
      companyName: 'Company Name',
      companyType: 'Company Type',
      locationName: 'Location',
      ownerName: 'Owner Name',
      phoneNumber: 'Phone Number',
      alternativePhoneNumber: 'Alt Phone Number',
      address: 'Address',
      createdAt: 'Created Date',
    });
    toast.success(`Exported ${exportData.length} companies to ${format.toUpperCase()}`);
  };

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => companyService.delete(id),
    onSuccess: () => {
      toast.success('Company deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete company');
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (editingCompany) {
        return companyService.update(editingCompany._id, formData);
      } else {
        return companyService.create(formData);
      }
    },
    onSuccess: () => {
      toast.success(editingCompany ? 'Company updated!' : 'Company created!');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setModalOpen(false);
      setEditingCompany(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save company');
    },
  });

  const locations = locationsData || [];
  const companies = companiesData?.data || [];
  const pagination = companiesData?.pagination;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Companies"
        description="Manage corporate clients, deployment sites, and work profiles."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExportModalOpen(true)}
              className="text-xs bg-white hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5 mr-1 text-slate-600" /> Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportModalOpen(true)}
              className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
            >
              <Upload className="h-3.5 w-3.5 mr-1 text-amber-600" /> Import
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingCompany(null);
                setModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Company
            </Button>
          </div>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <SearchInput
          placeholder="Search by company name, owner, phone..."
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        <div className="w-full sm:w-64">
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
        </div>
      </div>

      {/* Table / List */}
      {isLoading ? (
        <LoadingState rows={6} />
      ) : companies.length > 0 ? (
        <div className="space-y-4">
          {/* Mobile Card List View (< md) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {companies.map((comp: any) => {
              const locName = typeof comp.locationId === 'object' ? comp.locationId?.name : 'Location';
              return (
                <div
                  key={comp._id}
                  onClick={() => navigate(`/companies/${comp._id}`)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 cursor-pointer hover:border-[#2872A1] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#CBDDE9]/60 text-[#172B3A] overflow-hidden flex items-center justify-center font-extrabold text-sm shrink-0 border border-slate-200">
                        {comp.profileImage ? (
                          <img src={comp.profileImage} alt={comp.companyName} className="h-full w-full object-cover" />
                        ) : (
                          comp.companyName.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#172B3A]">{comp.companyName}</h3>
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 mt-0.5">
                          {comp.companyType}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{formatDate(comp.createdAt)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{locName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{comp.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{comp.phoneNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => navigate(`/companies/${comp._id}`)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        setEditingCompany(comp);
                        setModalOpen(true);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteId(comp._id)}
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
                  <TableHead>Company Profile</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((comp: any) => {
                  const locName = typeof comp.locationId === 'object' ? comp.locationId?.name : 'Location';

                  return (
                    <TableRow
                      key={comp._id}
                      className="cursor-pointer hover:bg-sky-50/30"
                      onClick={() => navigate(`/companies/${comp._id}`)}
                    >
                      <TableCell className="font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-[#CBDDE9]/60 text-[#172B3A] overflow-hidden flex items-center justify-center font-extrabold text-sm shrink-0 border border-slate-200">
                            {comp.profileImage ? (
                              <img src={comp.profileImage} alt={comp.companyName} className="h-full w-full object-cover" />
                            ) : (
                              comp.companyName.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#172B3A]">{comp.companyName}</p>
                            <p className="text-xs text-slate-500">{comp.address}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-700">{comp.companyType}</TableCell>
                      <TableCell className="text-xs font-semibold text-slate-800">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{locName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-700 font-medium">{comp.ownerName}</TableCell>
                      <TableCell className="text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{comp.phoneNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{formatDate(comp.createdAt)}</TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Company Details"
                            onClick={() => navigate(`/companies/${comp._id}`)}
                          >
                            <Eye className="h-4 w-4 text-[#2872A1]" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit Company"
                            onClick={() => {
                              setEditingCompany(comp);
                              setModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 text-slate-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Company"
                            onClick={() => setDeleteId(comp._id)}
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
          title="No companies found"
          description={search || locationFilter ? 'Try clearing your filters.' : 'Create your first client company to start managing works.'}
          actionLabel="Add Company"
          onAction={() => {
            setEditingCompany(null);
            setModalOpen(true);
          }}
        />
      )}

      {/* Form Modal */}
      <CompanyFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCompany(null);
        }}
        company={editingCompany}
        locations={locations}
        onSubmit={async (fd) => {
          await saveMutation.mutateAsync(fd);
        }}
        isLoading={saveMutation.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Company"
        description="Are you sure you want to delete this company? If the company has historical work records, it will be soft deleted."
        isLoading={deleteMutation.isPending}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import Client Companies"
        moduleType="companies"
        requiredFields={[
          { key: 'companyName', label: 'Company Name' },
          { key: 'companyType', label: 'Company Type' },
        ]}
        onImport={async (data) => {
          const res = await companyService.bulkImport(data);
          return {
            importedCount: res.data?.importedCount || data.length,
            skippedCount: res.data?.skippedCount || 0,
          };
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['companies'] });
        }}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Export Client Companies"
        totalRecords={companies.length}
        onExport={handleExport}
      />
    </div>
  );
};
