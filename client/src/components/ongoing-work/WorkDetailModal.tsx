import React from 'react';
import { Calendar, MapPin, Building, Users, Clock } from 'lucide-react';
import { Dialog } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { StatusBadge } from '../common/StatusBadge';
import { OngoingWork } from '../../types';
import { formatDate, calculateInclusiveDays } from '../../lib/dateUtils';

export interface WorkDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: OngoingWork | null;
}

export const WorkDetailModal: React.FC<WorkDetailModalProps> = ({
  isOpen,
  onClose,
  work,
}) => {
  if (!work) return null;

  const companyName = typeof work.company === 'object' ? work.company?.companyName : 'Company';
  const locationName = typeof work.location === 'object' ? work.location?.name : 'Location';
  const totalDays = work.totalDurationDays || work.durationDays || calculateInclusiveDays(work.overallStartDate, work.overallEndDate);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Project Work Details"
      description={`Complete breakdown of project timeline and employee deployment.`}
      maxWidth="3xl"
    >
      <div className="space-y-6 mt-4">
        {/* Project Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Building className="h-4 w-4 text-[#2872A1]" />
              <span>Company & Location</span>
            </div>
            <p className="text-sm font-extrabold text-[#172B3A]">{companyName}</p>
            <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{locationName}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Calendar className="h-4 w-4 text-[#2872A1]" />
              <span>Overall Timeline</span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {formatDate(work.overallStartDate)} - {formatDate(work.overallEndDate)}
            </p>
            <div className="flex items-center gap-1 text-xs text-[#2872A1] font-semibold mt-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{totalDays} Total Calendar Days</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Project Status</span>
              <StatusBadge status={work.status} />
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs font-bold text-slate-700">
              <Users className="h-4 w-4 text-[#2872A1]" />
              <span>{work.employees?.length || 0} Assigned Employees</span>
            </div>
          </div>
        </div>

        {/* Assigned Employees Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-extrabold text-[#172B3A] flex items-center gap-2">
              <Users className="h-4 w-4 text-[#2872A1]" />
              Assigned Workforce & Working Days
            </h4>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-2 md:hidden">
            {work.employees && work.employees.length > 0 ? (
              work.employees.map((emp: any, index: number) => {
                const empName = emp.employeeName || (typeof emp.employeeId === 'object' ? (emp.employeeId as any)?.name : 'Employee');
                const empTrade = emp.jobTypeName || emp.jobType || (typeof emp.jobTypeId === 'object' ? (emp.jobTypeId as any)?.name : 'Trade');
                const empWorkingDays = emp.workingDays || calculateInclusiveDays(emp.startDate, emp.endDate);

                return (
                  <div key={index} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#172B3A] text-sm">{empName}</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#CBDDE9]/60 text-[#172B3A]">
                        {empTrade}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-200/60 pt-2">
                      <span>{formatDate(emp.startDate)} → {formatDate(emp.endDate)}</span>
                      <span className="font-extrabold text-[#2872A1]">{empWorkingDays} Days</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-slate-400 py-4 text-xs">
                No individual employee details available.
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Job Type / Trade</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Working Days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {work.employees && work.employees.length > 0 ? (
                  work.employees.map((emp: any, index: number) => {
                    const empName = emp.employeeName || (typeof emp.employeeId === 'object' ? (emp.employeeId as any)?.name : 'Employee');
                    const empTrade = emp.jobTypeName || emp.jobType || (typeof emp.jobTypeId === 'object' ? (emp.jobTypeId as any)?.name : 'Trade');
                    const empWorkingDays = emp.workingDays || calculateInclusiveDays(emp.startDate, emp.endDate);

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-semibold text-slate-900">{empName}</TableCell>
                        <TableCell>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#CBDDE9]/60 text-[#172B3A]">
                            {empTrade}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">{formatDate(emp.startDate)}</TableCell>
                        <TableCell className="text-xs text-slate-600">{formatDate(emp.endDate)}</TableCell>
                        <TableCell className="text-right font-extrabold text-[#2872A1]">
                          {empWorkingDays} Days
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-400 py-4">
                      No individual employee details available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
