import { OngoingWork, WorkStatus } from '../models/OngoingWork.js';
import { Employee } from '../models/Employee.js';
import { JobType } from '../models/JobType.js';
import { Company } from '../models/Company.js';
import { ApiError } from '../utils/apiError.js';
import { calculateWorkingDays } from '../utils/date.js';

export class OngoingWorkService {
  static async getAll(filters: {
    search?: string;
    locationId?: string;
    jobTypeId?: string;
    status?: WorkStatus | 'ALL';
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const query: any = { isDeleted: false };

    if (filters.status && filters.status !== 'ALL') {
      query.status = filters.status;
    } else if (!filters.status) {
      query.status = 'ONGOING'; // Default to ONGOING works
    }

    if (filters.locationId) {
      query.locationId = filters.locationId;
    }

    if (filters.jobTypeId) {
      query['employees.jobTypeId'] = filters.jobTypeId;
    }

    const skip = (page - 1) * limit;

    let works = await OngoingWork.find(query)
      .populate('companyId', 'companyName companyType profileImage ownerName phoneNumber')
      .populate('locationId', 'name')
      .populate('employees.employeeId', 'name phoneNumber status')
      .populate('employees.jobTypeId', 'name')
      .sort({ overallStartDate: -1 });

    // Client-side / In-memory text search if search param is passed (supports company name & employee name)
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      works = works.filter((w) => {
        const companyName = (w.companyId as any)?.companyName || '';
        const hasMatchingEmployee = w.employees.some(
          (emp) =>
            searchRegex.test(emp.employeeNameSnapshot || (emp.employeeId as any)?.name || '') ||
            searchRegex.test((emp.employeeId as any)?.phoneNumber || '')
        );
        return searchRegex.test(companyName) || hasMatchingEmployee;
      });
    }

    const total = works.length;
    const paginatedWorks = works.slice(skip, skip + limit);

    const data = paginatedWorks.map((w) => {
      const days = calculateWorkingDays(w.overallStartDate, w.overallEndDate);
      return {
        _id: w._id,
        company: w.companyId,
        location: w.locationId,
        overallStartDate: w.overallStartDate,
        overallEndDate: w.overallEndDate,
        durationDays: days,
        status: w.status,
        employeeCount: w.employees.length,
        employees: w.employees.map((emp) => ({
          employeeId: emp.employeeId,
          employeeName: emp.employeeNameSnapshot || (emp.employeeId as any)?.name || 'Unknown',
          jobType: emp.jobTypeNameSnapshot || (emp.jobTypeId as any)?.name || 'Unknown',
          startDate: emp.startDate,
          endDate: emp.endDate,
          workingDays: calculateWorkingDays(emp.startDate, emp.endDate),
        })),
        createdAt: w.createdAt,
      };
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getById(id: string) {
    const work = await OngoingWork.findOne({ _id: id, isDeleted: false })
      .populate('companyId', 'companyName companyType profileImage ownerName phoneNumber address')
      .populate('locationId', 'name')
      .populate('employees.employeeId', 'name phoneNumber address status')
      .populate('employees.jobTypeId', 'name');

    if (!work) throw new ApiError(404, 'Work assignment not found');

    const durationDays = calculateWorkingDays(work.overallStartDate, work.overallEndDate);

    return {
      _id: work._id,
      company: work.companyId,
      location: work.locationId,
      overallStartDate: work.overallStartDate,
      overallEndDate: work.overallEndDate,
      totalDurationDays: durationDays,
      status: work.status,
      employeeCount: work.employees.length,
      employees: work.employees.map((emp) => ({
        employeeId: emp.employeeId,
        jobTypeId: emp.jobTypeId,
        employeeName: emp.employeeNameSnapshot || (emp.employeeId as any)?.name || 'Unknown',
        jobTypeName: emp.jobTypeNameSnapshot || (emp.jobTypeId as any)?.name || 'Unknown',
        startDate: emp.startDate,
        endDate: emp.endDate,
        workingDays: calculateWorkingDays(emp.startDate, emp.endDate),
        assignedAt: emp.assignedAt,
      })),
      createdAt: work.createdAt,
      updatedAt: work.updatedAt,
    };
  }

  static async create(payload: {
    companyId: string;
    locationId: string;
    overallStartDate: string | Date;
    overallEndDate: string | Date;
    employees: Array<{
      employeeId: string;
      jobTypeId: string;
      startDate: string | Date;
      endDate: string | Date;
    }>;
  }) {
    const overallStart = new Date(payload.overallStartDate);
    const overallEnd = new Date(payload.overallEndDate);

    if (overallEnd < overallStart) {
      throw new ApiError(400, 'Overall end date cannot be before overall start date');
    }

    const company = await Company.findOne({ _id: payload.companyId, isDeleted: false });
    if (!company) throw new ApiError(404, 'Selected company not found');

    // EMPLOYEE CONFLICT VALIDATION (Section 20 & 30 of prompt requirement)
    const processedEmployees = [];

    for (const empAssignment of payload.employees) {
      const empStart = new Date(empAssignment.startDate);
      const empEnd = new Date(empAssignment.endDate);

      if (empEnd < empStart) {
        throw new ApiError(400, `Employee start date cannot be after end date.`);
      }

      // Check if employee exists and is active
      const employee = await Employee.findOne({ _id: empAssignment.employeeId, isDeleted: false });
      if (!employee) {
        throw new ApiError(404, `Employee with ID ${empAssignment.employeeId} not found`);
      }

      if (employee.status !== 'ACTIVE') {
        throw new ApiError(400, `Employee ${employee.name} is currently ${employee.status} and cannot be assigned.`);
      }

      const jobType = await JobType.findById(empAssignment.jobTypeId);

      // Check overlapping active/upcoming projects for this employee
      const conflictingWorks = await OngoingWork.find({
        isDeleted: false,
        status: { $in: ['ONGOING', 'UPCOMING'] },
        'employees.employeeId': empAssignment.employeeId,
      }).populate('companyId', 'companyName');

      for (const work of conflictingWorks) {
        // Find specific employee schedule inside this work
        const existingEmpSche = work.employees.find(
          (e) => e.employeeId.toString() === empAssignment.employeeId
        );
        const existingStart = existingEmpSche ? new Date(existingEmpSche.startDate) : new Date(work.overallStartDate);
        const existingEnd = existingEmpSche ? new Date(existingEmpSche.endDate) : new Date(work.overallEndDate);

        // Check if date ranges overlap: (StartA <= EndB) and (EndA >= StartB)
        if (empStart <= existingEnd && empEnd >= existingStart) {
          const compName = (work.companyId as any)?.companyName || 'another company';
          const formattedStart = existingStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
          const formattedEnd = existingEnd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

          throw new ApiError(
            400,
            `${employee.name} is already assigned to another project (${compName}) from ${formattedStart} to ${formattedEnd}.`
          );
        }
      }

      processedEmployees.push({
        employeeId: employee._id,
        jobTypeId: jobType ? jobType._id : empAssignment.jobTypeId,
        employeeNameSnapshot: employee.name,
        jobTypeNameSnapshot: jobType ? jobType.name : 'Unknown',
        startDate: empStart,
        endDate: empEnd,
        status: 'ASSIGNED',
        assignedAt: new Date(),
      });
    }

    // Determine initial status based on start date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const workStatus: WorkStatus = overallStart > today ? 'UPCOMING' : 'ONGOING';

    const ongoingWork = await OngoingWork.create({
      companyId: payload.companyId,
      locationId: payload.locationId,
      overallStartDate: overallStart,
      overallEndDate: overallEnd,
      status: workStatus,
      employees: processedEmployees,
    });

    return this.getById(ongoingWork._id.toString());
  }

  static async completeWork(id: string) {
    const work = await OngoingWork.findOne({ _id: id, isDeleted: false });
    if (!work) throw new ApiError(404, 'Work assignment not found');

    work.status = 'COMPLETED';
    await work.save();

    return { message: 'Work marked as completed successfully', work };
  }

  static async cancelWork(id: string) {
    const work = await OngoingWork.findOne({ _id: id, isDeleted: false });
    if (!work) throw new ApiError(404, 'Work assignment not found');

    work.status = 'CANCELLED';
    await work.save();

    return { message: 'Work cancelled successfully', work };
  }

  static async delete(id: string) {
    const work = await OngoingWork.findOne({ _id: id, isDeleted: false });
    if (!work) throw new ApiError(404, 'Work assignment not found');

    work.isDeleted = true;
    await work.save();
    return { message: 'Work deleted successfully' };
  }
}
