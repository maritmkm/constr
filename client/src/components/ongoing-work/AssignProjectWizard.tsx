import React, { useState, useEffect } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Building,
  Users,
  Calendar,
  CheckCircle2,
  Search,
  Filter,
  AlertCircle,
} from 'lucide-react';
import { Sheet } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { StatusBadge } from '../common/StatusBadge';
import { Company, Employee, Location, JobType } from '../../types';
import { formatDate, calculateInclusiveDays, formatDateForInput } from '../../lib/dateUtils';
import { companyService } from '../../services/company.service';
import { employeeService } from '../../services/employee.service';
import { ongoingWorkService } from '../../services/ongoingWork.service';
import { toast } from 'sonner';

export interface AssignProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
  jobTypes: JobType[];
  onSuccess: () => void;
}

interface SelectedEmployeeConfig {
  employee: Employee;
  startDate: string;
  endDate: string;
}

export const AssignProjectWizard: React.FC<AssignProjectWizardProps> = ({
  isOpen,
  onClose,
  locations,
  jobTypes,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State: Companies
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [companyLocationFilter, setCompanyLocationFilter] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Step 2 State: Employees
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [empSearch, setEmpSearch] = useState('');
  const [empJobTypeFilter, setEmpJobTypeFilter] = useState('');
  const [empLocationFilter, setEmpLocationFilter] = useState('');
  const [selectedEmpConfigs, setSelectedEmpConfigs] = useState<SelectedEmployeeConfig[]>([]);

  // Step 3 State: Project Dates
  const [overallStartDate, setOverallStartDate] = useState<string>(
    formatDateForInput(new Date())
  );
  const [overallEndDate, setOverallEndDate] = useState<string>(
    formatDateForInput(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))
  );

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Companies when Wizard Opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedCompany(null);
      setSelectedEmpConfigs([]);
      setErrorMessage(null);
      fetchCompanies();
    }
  }, [isOpen]);

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const res = await companyService.getAll({
        search: companySearch,
        locationId: companyLocationFilter,
        limit: 50,
      });
      setCompanies(res.data);
    } catch (e) {
      toast.error('Failed to load companies');
    } finally {
      setLoadingCompanies(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentStep === 1) {
      fetchCompanies();
    }
  }, [companySearch, companyLocationFilter]);

  // Fetch Employees for Step 2
  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await employeeService.getAll({
        search: empSearch,
        jobTypeId: empJobTypeFilter,
        locationId: empLocationFilter,
        limit: 100,
      });
      setEmployees(res.data);
    } catch (e) {
      toast.error('Failed to load employees');
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentStep === 2) {
      fetchEmployees();
    }
  }, [empSearch, empJobTypeFilter, empLocationFilter, currentStep]);

  // Update employee dates when overall dates change
  useEffect(() => {
    setSelectedEmpConfigs((prev) =>
      prev.map((cfg) => ({
        ...cfg,
        startDate: overallStartDate,
        endDate: overallEndDate,
      }))
    );
  }, [overallStartDate, overallEndDate]);

  const toggleSelectEmployee = (emp: Employee) => {
    const exists = selectedEmpConfigs.some((cfg) => cfg.employee._id === emp._id);
    if (exists) {
      setSelectedEmpConfigs((prev) => prev.filter((cfg) => cfg.employee._id !== emp._id));
    } else {
      setSelectedEmpConfigs((prev) => [
        ...prev,
        {
          employee: emp,
          startDate: overallStartDate,
          endDate: overallEndDate,
        },
      ]);
    }
  };

  const updateIndividualEmpDate = (empId: string, field: 'startDate' | 'endDate', value: string) => {
    setSelectedEmpConfigs((prev) =>
      prev.map((cfg) =>
        cfg.employee._id === empId ? { ...cfg, [field]: value } : cfg
      )
    );
  };

  const checkEmployeeDateConflict = (
    emp: Employee,
    startDateStr: string,
    endDateStr: string
  ) => {
    if (!emp.activeAssignments || emp.activeAssignments.length === 0) {
      return null;
    }

    const reqStart = new Date(startDateStr);
    const reqEnd = new Date(endDateStr);
    reqStart.setHours(0, 0, 0, 0);
    reqEnd.setHours(23, 59, 59, 999);

    for (const assign of emp.activeAssignments) {
      const existingStart = new Date(assign.startDate);
      const existingEnd = new Date(assign.endDate);
      existingStart.setHours(0, 0, 0, 0);
      existingEnd.setHours(23, 59, 59, 999);

      if (reqStart <= existingEnd && reqEnd >= existingStart) {
        return assign;
      }
    }
    return null;
  };

  const handleStep1Next = () => {
    if (!selectedCompany) {
      toast.error('Please select a company to continue');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    if (selectedEmpConfigs.length === 0) {
      toast.error('Please select at least one employee');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(3);
  };

  const handleStep3Next = () => {
    if (!overallStartDate || !overallEndDate) {
      toast.error('Please select valid overall project dates');
      return;
    }
    if (new Date(overallEndDate) < new Date(overallStartDate)) {
      toast.error('Overall end date cannot be before overall start date');
      return;
    }

    // Check individual employee dates and active assignment date conflicts
    const overallStart = new Date(overallStartDate);
    const overallEnd = new Date(overallEndDate);

    for (const cfg of selectedEmpConfigs) {
      const empStart = new Date(cfg.startDate);
      const empEnd = new Date(cfg.endDate);

      if (empEnd < empStart) {
        toast.error(`Invalid date range for employee ${cfg.employee.name}`);
        return;
      }

      if (empStart < overallStart || empStart > overallEnd || empEnd < overallStart || empEnd > overallEnd) {
        const errorMsg = `Individual start and end dates for "${cfg.employee.name}" must be within the Overall Project Timeline (${formatDate(overallStartDate)} to ${formatDate(overallEndDate)}).`;
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const conflict = checkEmployeeDateConflict(cfg.employee, cfg.startDate, cfg.endDate);
      if (conflict) {
        const errorMsg = `Employee "${cfg.employee.name}" is already assigned to "${conflict.companyName}" from ${formatDate(conflict.startDate)} to ${formatDate(conflict.endDate)}. Please select unassigned dates.`;
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        return;
      }
    }

    setErrorMessage(null);
    setCurrentStep(4);
  };

  const handleFinalSubmit = async () => {
    if (!selectedCompany) return;
    setSubmitting(true);
    setErrorMessage(null);

    const payload = {
      companyId: selectedCompany._id,
      locationId:
        typeof selectedCompany.locationId === 'object'
          ? selectedCompany.locationId._id
          : selectedCompany.locationId,
      overallStartDate,
      overallEndDate,
      employees: selectedEmpConfigs.map((cfg) => ({
        employeeId: cfg.employee._id,
        jobTypeId:
          typeof cfg.employee.jobTypeId === 'object'
            ? cfg.employee.jobTypeId._id
            : cfg.employee.jobTypeId,
        startDate: cfg.startDate,
        endDate: cfg.endDate,
      })),
    };

    try {
      await ongoingWorkService.create(payload);
      toast.success('Project assigned successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      const errText = err.response?.data?.message || err.message || 'Failed to assign project';
      setErrorMessage(errText);
      toast.error(errText);
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: 'Company', icon: Building },
    { number: 2, label: 'Employees', icon: Users },
    { number: 3, label: 'Dates', icon: Calendar },
    { number: 4, label: 'Review', icon: CheckCircle2 },
  ];

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Assign New Project"
      description="Multi-step wizard to assign workforce deployment to a client company."
      size="xl"
    >
      <div className="flex flex-col h-full">
        {/* Progress Bar Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const Icon = step.icon;

            return (
              <React.Fragment key={step.number}>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#2872A1] text-white shadow-md shadow-[#2872A1]/30'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : step.number}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:inline ${
                      isCurrent ? 'text-[#172B3A]' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 bg-slate-200" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: COMPANY SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Input
                  placeholder="Search company by name or owner..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  options={[
                    { label: 'All Locations', value: '' },
                    ...locations.map((l) => ({ label: l.name, value: l._id })),
                  ]}
                  value={companyLocationFilter}
                  onChange={(e) => setCompanyLocationFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((comp) => {
                    const isSelected = selectedCompany?._id === comp._id;
                    const locName = typeof comp.locationId === 'object' ? comp.locationId?.name : 'Location';

                    return (
                      <TableRow
                        key={comp._id}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#CBDDE9]/50 font-bold border-l-4 border-l-[#2872A1]' : ''
                        }`}
                        onClick={() => setSelectedCompany(comp)}
                      >
                        <TableCell className="font-semibold text-slate-900">
                          {comp.companyName}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">{comp.companyType}</TableCell>
                        <TableCell className="text-xs text-slate-600">{locName}</TableCell>
                        <TableCell className="text-xs text-slate-600">{comp.ownerName}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant={isSelected ? 'sky' : 'outline'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCompany(comp);
                            }}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* STEP 2: EMPLOYEE SELECTION */}
        {currentStep === 2 && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                placeholder="Search employee name/phone..."
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />

              <Select
                options={[
                  { label: 'Filter Job Type (All)', value: '' },
                  ...jobTypes.map((j) => ({ label: j.name, value: j._id })),
                ]}
                value={empJobTypeFilter}
                onChange={(e) => setEmpJobTypeFilter(e.target.value)}
              />

              <Select
                options={[
                  { label: 'Filter Location (All)', value: '' },
                  ...locations.map((l) => ({ label: l.name, value: l._id })),
                ]}
                value={empLocationFilter}
                onChange={(e) => setEmpLocationFilter(e.target.value)}
              />
            </div>

            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Selected {selectedEmpConfigs.length} employee(s)</span>
              {selectedEmpConfigs.length > 0 && (
                <button
                  onClick={() => setSelectedEmpConfigs([])}
                  className="text-xs text-[#2872A1] hover:underline font-semibold"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">Select</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Job Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Work</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => {
                    const isSelected = selectedEmpConfigs.some((c) => c.employee._id === emp._id);
                    const jtName = typeof emp.jobTypeId === 'object' ? emp.jobTypeId?.name : 'Trade';
                    const locName = typeof emp.locationId === 'object' ? emp.locationId?.name : 'Location';

                    return (
                      <TableRow
                        key={emp._id}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#CBDDE9]/50 font-bold border-l-4 border-l-[#2872A1]' : ''
                        }`}
                        onClick={() => toggleSelectEmployee(emp)}
                      >
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectEmployee(emp)}
                            className="h-4 w-4 rounded-xs border-slate-300 text-[#2872A1] focus:ring-[#2872A1]"
                          />
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">
                          <div>
                            <p className="text-sm font-bold text-[#172B3A]">{emp.name}</p>
                            <p className="text-[11px] text-slate-500">{emp.phoneNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#CBDDE9]/60 text-[#172B3A]">
                            {jtName}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">{locName}</TableCell>
                        <TableCell>
                          <StatusBadge status={emp.status} />
                        </TableCell>
                        <TableCell className="text-xs">
                          {emp.activeAssignments && emp.activeAssignments.length > 0 ? (
                            <div className="space-y-1">
                              {emp.activeAssignments.map((assign: any, idx: number) => (
                                <div key={idx} className="bg-amber-50 text-amber-900 border border-amber-200 rounded px-2 py-1 text-[11px]">
                                  <span className="font-bold block">{assign.companyName}</span>
                                  <span className="text-[10px] text-amber-700 block">
                                    {formatDate(assign.startDate)} - {formatDate(assign.endDate)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : emp.currentWork && emp.currentWork !== 'None' ? (
                            <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded px-2 py-1 text-[11px]">
                              <span className="font-bold block">{emp.currentWork}</span>
                              {emp.currentWorkStartDate && emp.currentWorkEndDate && (
                                <span className="text-[10px] text-amber-700 block">
                                  {formatDate(emp.currentWorkStartDate)} - {formatDate(emp.currentWorkEndDate)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Available / Unassigned
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIGURE DATES */}
        {currentStep === 3 && (
          <div className="space-y-6 flex-1 overflow-y-auto pr-1">
            <div className="p-4 rounded-xl border border-[#CBDDE9] bg-sky-50/50 space-y-4">
              <h4 className="text-sm font-extrabold text-[#172B3A] flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#2872A1]" />
                Overall Project Timeline
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Overall Project Start Date *
                  </label>
                  <Input
                    type="date"
                    value={overallStartDate}
                    onChange={(e) => setOverallStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Overall Project End Date *
                  </label>
                  <Input
                    type="date"
                    value={overallEndDate}
                    onChange={(e) => setOverallEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="text-xs font-bold text-[#2872A1]">
                Total Duration: {calculateInclusiveDays(overallStartDate, overallEndDate)} Calendar Days
              </div>
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-[#172B3A] mb-3">
                Individual Employee Assignment Dates
              </h4>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Job Type</TableHead>
                      <TableHead>Individual Start Date</TableHead>
                      <TableHead>Individual End Date</TableHead>
                      <TableHead className="text-right">Working Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEmpConfigs.map((cfg) => {
                      const jtName = typeof cfg.employee.jobTypeId === 'object' ? cfg.employee.jobTypeId?.name : 'Trade';
                      const days = calculateInclusiveDays(cfg.startDate, cfg.endDate);
                      const conflict = checkEmployeeDateConflict(cfg.employee, cfg.startDate, cfg.endDate);

                      const empStart = new Date(cfg.startDate);
                      const empEnd = new Date(cfg.endDate);
                      const overallStart = new Date(overallStartDate);
                      const overallEnd = new Date(overallEndDate);
                      const isOutOfRange = empStart < overallStart || empStart > overallEnd || empEnd < overallStart || empEnd > overallEnd;

                      return (
                        <TableRow key={cfg.employee._id} className={conflict || isOutOfRange ? 'bg-red-50/60 border-l-4 border-l-red-500' : ''}>
                          <TableCell className="font-semibold text-slate-900">
                            {cfg.employee.name}
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">{jtName}</TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              min={overallStartDate}
                              max={overallEndDate}
                              className={`h-8 text-xs ${conflict || isOutOfRange ? 'border-red-500 bg-red-50 text-red-900 font-semibold' : ''}`}
                              value={cfg.startDate}
                              onChange={(e) =>
                                updateIndividualEmpDate(cfg.employee._id, 'startDate', e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              min={overallStartDate}
                              max={overallEndDate}
                              className={`h-8 text-xs ${conflict || isOutOfRange ? 'border-red-500 bg-red-50 text-red-900 font-semibold' : ''}`}
                              value={cfg.endDate}
                              onChange={(e) =>
                                updateIndividualEmpDate(cfg.employee._id, 'endDate', e.target.value)
                              }
                            />
                            {isOutOfRange && (
                              <p className="text-[11px] text-red-600 font-bold mt-1">
                                ⚠️ Dates must be within overall timeline ({formatDate(overallStartDate)} to {formatDate(overallEndDate)})
                              </p>
                            )}
                            {!isOutOfRange && conflict && (
                              <p className="text-[11px] text-red-600 font-bold mt-1">
                                ❌ Assigned to {conflict.companyName} ({formatDate(conflict.startDate)} - {formatDate(conflict.endDate)})
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-extrabold text-[#2872A1]">
                            {days} Days
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & ASSIGN */}
        {currentStep === 4 && selectedCompany && (
          <div className="space-y-6 flex-1 overflow-y-auto pr-1">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-semibold text-slate-500">Selected Company</span>
                <span className="text-sm font-extrabold text-[#172B3A]">{selectedCompany.companyName}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-semibold text-slate-500">Location</span>
                <span className="text-xs font-bold text-slate-700">
                  {typeof selectedCompany.locationId === 'object' ? selectedCompany.locationId.name : 'Location'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-semibold text-slate-500">Project Timeline</span>
                <span className="text-xs font-bold text-slate-800">
                  {formatDate(overallStartDate)} - {formatDate(overallEndDate)} ({calculateInclusiveDays(overallStartDate, overallEndDate)} Days)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Workforce Assigned</span>
                <span className="text-xs font-bold text-[#2872A1]">{selectedEmpConfigs.length} Employees</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-[#172B3A] mb-3">
                Assigned Employee Summary
              </h4>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Job Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-right">Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEmpConfigs.map((cfg) => {
                      const jtName = typeof cfg.employee.jobTypeId === 'object' ? cfg.employee.jobTypeId?.name : 'Trade';
                      return (
                        <TableRow key={cfg.employee._id}>
                          <TableCell className="font-semibold text-slate-900">{cfg.employee.name}</TableCell>
                          <TableCell className="text-xs text-slate-600">{jtName}</TableCell>
                          <TableCell className="text-xs text-slate-600">{formatDate(cfg.startDate)}</TableCell>
                          <TableCell className="text-xs text-slate-600">{formatDate(cfg.endDate)}</TableCell>
                          <TableCell className="text-right font-bold text-[#2872A1]">
                            {calculateInclusiveDays(cfg.startDate, cfg.endDate)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="pt-4 border-t border-slate-200 mt-6 flex items-center justify-between bg-white">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setErrorMessage(null);
                setCurrentStep((prev) => (prev - 1) as any);
              }}
              disabled={submitting}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}

          {currentStep < 4 ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                if (currentStep === 1) handleStep1Next();
                else if (currentStep === 2) handleStep2Next();
                else if (currentStep === 3) handleStep3Next();
              }}
            >
              Next Step <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleFinalSubmit}
              isLoading={submitting}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" /> Confirm & Assign Project
            </Button>
          )}
        </div>
      </div>
    </Sheet>
  );
};
