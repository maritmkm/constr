import { Employee } from '../models/Employee.js';
import { OngoingWork } from '../models/OngoingWork.js';
import { ApiError } from '../utils/apiError.js';

export class EmployeeService {
  static async getAll(filters: { search?: string; locationId?: string; jobTypeId?: string; status?: string; page?: number; limit?: number }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const query: any = { isDeleted: false };

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { phoneNumber: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.locationId) {
      query.locationId = filters.locationId;
    }

    if (filters.jobTypeId) {
      query.jobTypeId = filters.jobTypeId;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    const skip = (page - 1) * limit;
    const [employees, total] = await Promise.all([
      Employee.find(query)
        .populate('locationId', 'name')
        .populate('jobTypeId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Employee.countDocuments(query),
    ]);

    // Attach current active work assignment for each employee if available
    const employeeIds = employees.map((e) => e._id);
    const activeWorks = await OngoingWork.find({
      'employees.employeeId': { $in: employeeIds },
      status: { $in: ['ONGOING', 'UPCOMING'] },
      isDeleted: false,
    }).populate('companyId', 'companyName');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formattedEmployees = employees.map((emp) => {
      const empWorks = activeWorks.filter((w) =>
        w.employees.some((e) => e.employeeId.toString() === emp._id.toString())
      );

      const activeAssignments = empWorks.map((w) => {
        const empSub = w.employees.find((e) => e.employeeId.toString() === emp._id.toString());
        return {
          workId: w._id,
          companyId: (w.companyId as any)?._id || w.companyId,
          companyName: (w.companyId as any)?.companyName || 'Company',
          startDate: empSub?.startDate || w.overallStartDate,
          endDate: empSub?.endDate || w.overallEndDate,
          status: w.status,
        };
      });

      // Find assignment active today, or default to first assignment
      const currentAssign = activeAssignments.find((a) => {
        const s = new Date(a.startDate);
        const e = new Date(a.endDate);
        return today >= s && today <= e;
      }) || activeAssignments[0] || null;

      return {
        ...emp.toObject(),
        currentWork: currentAssign ? currentAssign.companyName : 'None',
        currentWorkId: currentAssign ? currentAssign.workId : null,
        currentWorkStartDate: currentAssign ? currentAssign.startDate : null,
        currentWorkEndDate: currentAssign ? currentAssign.endDate : null,
        activeAssignments,
      };
    });

    return {
      data: formattedEmployees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getById(id: string) {
    const employee = await Employee.findOne({ _id: id, isDeleted: false })
      .populate('locationId', 'name')
      .populate('jobTypeId', 'name');
    if (!employee) throw new ApiError(404, 'Employee not found');
    return employee;
  }

  static async create(payload: any) {
    const employee = await Employee.create(payload);
    return Employee.findById(employee._id)
      .populate('locationId', 'name')
      .populate('jobTypeId', 'name');
  }

  static async update(id: string, payload: any) {
    const employee = await Employee.findOneAndUpdate(
      { _id: id, isDeleted: false },
      payload,
      { new: true }
    )
      .populate('locationId', 'name')
      .populate('jobTypeId', 'name');

    if (!employee) throw new ApiError(404, 'Employee not found');
    return employee;
  }

  static async delete(id: string) {
    const employee = await Employee.findOne({ _id: id, isDeleted: false });
    if (!employee) throw new ApiError(404, 'Employee not found');

    const activeWork = await OngoingWork.findOne({
      'employees.employeeId': id,
      status: { $in: ['ONGOING', 'UPCOMING'] },
      isDeleted: false,
    });

    if (activeWork) {
      throw new ApiError(400, 'Cannot delete an employee who is currently assigned to an ongoing project.');
    }

    employee.isDeleted = true;
    await employee.save();
    return { message: 'Employee deleted successfully' };
  }

  static async bulkImport(employeesList: any[]) {
    if (!Array.isArray(employeesList) || employeesList.length === 0) {
      throw new ApiError(400, 'Invalid or empty employees list');
    }

    const { Location } = await import('../models/Location.js');
    const { JobType } = await import('../models/JobType.js');

    const [locations, jobTypes] = await Promise.all([
      Location.find({ isDeleted: false }),
      JobType.find({ isDeleted: false }),
    ]);

    const locationMap = new Map<string, string>();
    locations.forEach((l) => locationMap.set(l.name.toLowerCase(), l._id.toString()));

    const jobTypeMap = new Map<string, string>();
    jobTypes.forEach((j) => jobTypeMap.set(j.name.toLowerCase(), j._id.toString()));

    const createdEmployees: any[] = [];
    let skippedCount = 0;

    for (const item of employeesList) {
      if (!item.name || !item.phoneNumber) {
        skippedCount++;
        continue;
      }

      let locationId = item.locationId;
      if (!locationId && item.locationName) {
        const locKey = item.locationName.trim().toLowerCase();
        if (locationMap.has(locKey)) {
          locationId = locationMap.get(locKey);
        } else {
          const newLoc = await Location.create({ name: item.locationName.trim() });
          locationId = newLoc._id.toString();
          locationMap.set(locKey, locationId);
        }
      }

      if (!locationId && locations.length > 0) {
        locationId = locations[0]._id.toString();
      }

      let jobTypeId = item.jobTypeId;
      if (!jobTypeId && item.jobTypeName) {
        const jtKey = item.jobTypeName.trim().toLowerCase();
        if (jobTypeMap.has(jtKey)) {
          jobTypeId = jobTypeMap.get(jtKey);
        } else {
          const newJt = await JobType.create({ name: item.jobTypeName.trim() });
          jobTypeId = newJt._id.toString();
          jobTypeMap.set(jtKey, jobTypeId);
        }
      }

      if (!jobTypeId && jobTypes.length > 0) {
        jobTypeId = jobTypes[0]._id.toString();
      }

      let status = (item.status || 'ACTIVE').toUpperCase();
      if (!['ACTIVE', 'INACTIVE', 'ON_LEAVE'].includes(status)) {
        status = 'ACTIVE';
      }

      const created = await Employee.create({
        name: item.name,
        phoneNumber: item.phoneNumber,
        address: item.address || 'Address',
        alternativePhoneNumber: item.alternativePhoneNumber || '',
        locationId,
        jobTypeId,
        status,
      });

      createdEmployees.push(created);
    }

    return {
      importedCount: createdEmployees.length,
      skippedCount,
      employees: createdEmployees,
    };
  }
}
