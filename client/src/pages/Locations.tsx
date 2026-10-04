import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { SearchInput } from '../components/common/SearchInput';
import { Pagination } from '../components/ui/pagination';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LocationModal } from '../components/master/LocationModal';
import { locationService } from '../services/location.service';
import { Location } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { formatDate } from '../lib/dateUtils';
import { toast } from 'sonner';

export const Locations: React.FC = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: locationsData, isLoading } = useQuery({
    queryKey: ['locations', debouncedSearch, page],
    queryFn: async () => {
      const res = await locationService.getAll({
        search: debouncedSearch,
        page,
        limit: 10,
      });
      return res;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => locationService.delete(id),
    onSuccess: () => {
      toast.success('Location deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete location');
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingLocation) {
        return locationService.update(editingLocation._id, data);
      } else {
        return locationService.create(data);
      }
    },
    onSuccess: () => {
      toast.success(editingLocation ? 'Location updated!' : 'Location created!');
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setModalOpen(false);
      setEditingLocation(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save location');
    },
  });

  const locations = locationsData?.data || [];
  const pagination = locationsData?.pagination;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Location Master"
        description="Manage regional sites and branches for company and employee mapping."
        action={
          <Button
            variant="primary"
            onClick={() => {
              setEditingLocation(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Location
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <SearchInput
          placeholder="Search location name..."
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <LoadingState rows={5} />
      ) : locations.length > 0 ? (
        <div className="space-y-4">
          {/* Mobile Card List View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {locations.map((loc: any) => (
              <div key={loc._id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#2872A1]" />
                    <span className="font-bold text-[#172B3A] text-sm">{loc.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingLocation(loc);
                        setModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 text-slate-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setDeleteId(loc._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  Created: {formatDate(loc.createdAt)}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((loc: any) => (
                  <TableRow key={loc._id} className="hover:bg-sky-50/30">
                    <TableCell className="font-bold text-[#172B3A]">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#2872A1]" />
                        <span>{loc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{formatDate(loc.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingLocation(loc);
                            setModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(loc._id)}
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
          title="No locations found"
          description="Create master locations to map companies and employees."
          actionLabel="Add Location"
          onAction={() => {
            setEditingLocation(null);
            setModalOpen(true);
          }}
        />
      )}

      <LocationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingLocation(null);
        }}
        location={editingLocation}
        onSubmit={async (data) => {
          await saveMutation.mutateAsync(data);
        }}
        isLoading={saveMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Location"
        description="Are you sure you want to delete this location? If referenced by companies or employees, it will be soft deleted."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
