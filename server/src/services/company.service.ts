import { Company } from '../models/Company.js';
import { OngoingWork } from '../models/OngoingWork.js';
import { ApiError } from '../utils/apiError.js';
import { calculateWorkingDays } from '../utils/date.js';

export class CompanyService {
  static async getAll(search?: string, locationId?: string, page = 1, limit = 20) {
    const query: any = { isDeleted: false };

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { companyType: { $regex: search, $options: 'i' } },
      ];
    }

    if (locationId) {
      query.locationId = locationId;
    }

    const skip = (page - 1) * limit;
    const [companies, total] = await Promise.all([
      Company.find(query)
        .populate('locationId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Company.countDocuments(query),
    ]);

    return {
      data: companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getById(id: string) {
    const company = await Company.findOne({ _id: id, isDeleted: false }).populate('locationId', 'name');
    if (!company) throw new ApiError(404, 'Company not found');

    // Fetch stats for this company
    const works = await OngoingWork.find({ companyId: id, isDeleted: false });
    const totalWorks = works.length;
    const ongoingWorks = works.filter((w) => w.status === 'ONGOING' || w.status === 'UPCOMING').length;
    const completedWorks = works.filter((w) => w.status === 'COMPLETED').length;

    // Collect set of unique assigned employees
    const uniqueEmployees = new Set<string>();
    works.forEach((w) => {
      w.employees.forEach((emp) => uniqueEmployees.add(emp.employeeId.toString()));
    });

    return {
      company,
      stats: {
        totalWorks,
        ongoingWorks,
        completedWorks,
        totalEmployeesAssigned: uniqueEmployees.size,
      },
    };
  }

  static async create(payload: any) {
    const company = await Company.create(payload);
    return Company.findById(company._id).populate('locationId', 'name');
  }

  static async update(id: string, payload: any) {
    const company = await Company.findOneAndUpdate(
      { _id: id, isDeleted: false },
      payload,
      { new: true }
    ).populate('locationId', 'name');

    if (!company) throw new ApiError(404, 'Company not found');
    return company;
  }

  static async delete(id: string) {
    const company = await Company.findOne({ _id: id, isDeleted: false });
    if (!company) throw new ApiError(404, 'Company not found');

    const workCount = await OngoingWork.countDocuments({ companyId: id, isDeleted: false });
    if (workCount > 0) {
      // Soft deletion
      company.isDeleted = true;
      await company.save();
    } else {
      await Company.findByIdAndDelete(id);
    }
    return { message: 'Company deleted successfully' };
  }

  static async getWorkHistory(companyId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const query = { companyId, isDeleted: false };

    const [works, total] = await Promise.all([
      OngoingWork.find(query)
        .populate('locationId', 'name')
        .populate('employees.employeeId', 'name phoneNumber')
        .populate('employees.jobTypeId', 'name')
        .sort({ overallStartDate: -1 })
        .skip(skip)
        .limit(limit),
      OngoingWork.countDocuments(query),
    ]);

    const formattedWorks = works.map((w) => {
      const days = calculateWorkingDays(w.overallStartDate, w.overallEndDate);
      return {
        _id: w._id,
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
      data: formattedWorks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async bulkImport(companiesList: any[]) {
    if (!Array.isArray(companiesList) || companiesList.length === 0) {
      throw new ApiError(400, 'Invalid or empty companies list');
    }

    const { Location } = await import('../models/Location.js');
    const locations = await Location.find({ isDeleted: false });
    const locationMap = new Map<string, string>();
    locations.forEach((l) => locationMap.set(l.name.toLowerCase(), l._id.toString()));

    const createdCompanies: any[] = [];
    let skippedCount = 0;

    for (const item of companiesList) {
      if (!item.companyName || !item.companyType) {
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

      const created = await Company.create({
        companyName: item.companyName,
        companyType: item.companyType,
        locationId,
        ownerName: item.ownerName || 'Owner',
        address: item.address || 'Address',
        phoneNumber: item.phoneNumber || '+91 00000 00000',
        alternativePhoneNumber: item.alternativePhoneNumber || '',
      });

      createdCompanies.push(created);
    }

    return {
      importedCount: createdCompanies.length,
      skippedCount,
      companies: createdCompanies,
    };
  }
}
