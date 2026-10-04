import React, { useState } from 'react';
import { Eye, Calendar, Clock, MapPin } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { StatusBadge } from '../common/StatusBadge';
import { WorkDetailModal } from '../ongoing-work/WorkDetailModal';
import { OngoingWork } from '../../types';
import { formatDate, calculateInclusiveDays } from '../../lib/dateUtils';

export interface CompanyWorkHistoryTableProps {
  works: OngoingWork[];
}

export const CompanyWorkHistoryTable: React.FC<CompanyWorkHistoryTableProps> = ({ works }) => {
  const [selectedWork, setSelectedWork] = useState<OngoingWork | null>(null);

  return (
    <>
      {/* Mobile Card List View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {works.map((work) => {
          const locName = typeof work.location === 'object' ? work.location?.name : 'Location';
          const days = work.durationDays || calculateInclusiveDays(work.overallStartDate, work.overallEndDate);

          return (
            <div
              key={work._id}
              onClick={() => setSelectedWork(work)}
              className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 cursor-pointer hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-[#172B3A] font-bold text-sm">
                    <MapPin className="h-4 w-4 text-[#2872A1]" />
                    <span>{locName}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mt-1">
                    {work.employeeCount || work.employees?.length || 0} Employees
                  </p>
                </div>
                <StatusBadge status={work.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Start Date</span>
                  <span className="font-semibold text-slate-700">{formatDate(work.overallStartDate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">End Date</span>
                  <span className="font-semibold text-slate-700">{formatDate(work.overallEndDate)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-[#2872A1]">
                  {days} Days
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setSelectedWork(work);
                  }}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {works.map((work) => {
              const locName = typeof work.location === 'object' ? work.location?.name : 'Location';
              const days = work.durationDays || calculateInclusiveDays(work.overallStartDate, work.overallEndDate);

              return (
                <TableRow key={work._id} className="cursor-pointer hover:bg-sky-50/40" onClick={() => setSelectedWork(work)}>
                  <TableCell className="font-semibold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{locName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{formatDate(work.overallStartDate)}</TableCell>
                  <TableCell className="text-xs text-slate-600">{formatDate(work.overallEndDate)}</TableCell>
                  <TableCell className="text-xs font-semibold text-slate-700">
                    {work.employeeCount || work.employees?.length || 0} Employees
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={work.status} />
                  </TableCell>
                  <TableCell className="text-xs font-bold text-[#2872A1]">
                    {days} Days
                  </TableCell>
                  <TableCell className="text-right" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setSelectedWork(work)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <WorkDetailModal
        isOpen={!!selectedWork}
        onClose={() => setSelectedWork(null)}
        work={selectedWork}
      />
    </>
  );
};
