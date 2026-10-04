import { Company } from '../models/Company.js';
import { Employee } from '../models/Employee.js';
import { OngoingWork } from '../models/OngoingWork.js';
import { calculateWorkingDays } from '../utils/date.js';

export class DashboardService {
  static async getSummary() {
    const [
      totalCompanies,
      totalEmployees,
      activeEmployeesCount,
      ongoingWorksCount,
      completedWorksCount,
      ongoingWorksList,
      recentCompanies,
      recentWorks,
    ] = await Promise.all([
      Company.countDocuments({ isDeleted: false }),
      Employee.countDocuments({ isDeleted: false }),
      Employee.countDocuments({ isDeleted: false, status: 'ACTIVE' }),
      OngoingWork.countDocuments({ isDeleted: false, status: { $in: ['ONGOING', 'UPCOMING'] } }),
      OngoingWork.countDocuments({ isDeleted: false, status: 'COMPLETED' }),

      // Active Work Summary
      OngoingWork.find({ isDeleted: false, status: { $in: ['ONGOING', 'UPCOMING'] } })
        .populate('companyId', 'companyName profileImage')
        .populate('locationId', 'name')
        .populate('employees.employeeId', 'name')
        .sort({ overallStartDate: -1 })
        .limit(10),

      // Recent Companies
      Company.find({ isDeleted: false })
        .populate('locationId', 'name')
        .sort({ createdAt: -1 })
        .limit(5),

      // Recent Works
      OngoingWork.find({ isDeleted: false })
        .populate('companyId', 'companyName')
        .populate('locationId', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Calculate Available Employees count
    // Get all employees assigned to ongoing/upcoming works
    const assignedEmployeeIds = new Set<string>();
    ongoingWorksList.forEach((w) => {
      w.employees.forEach((emp) => assignedEmployeeIds.add(emp.employeeId.toString()));
    });

    const activeEmployees = await Employee.find({ isDeleted: false, status: 'ACTIVE' }, '_id');
    const availableEmployeesCount = activeEmployees.filter(
      (e) => !assignedEmployeeIds.has(e._id.toString())
    ).length;

    const formattedActiveWorks = ongoingWorksList.map((w) => ({
      _id: w._id,
      company: (w.companyId as any)?.companyName || 'Unknown',
      companyProfile: (w.companyId as any)?.profileImage || null,
      location: (w.locationId as any)?.name || 'Unknown',
      assignedEmployeesCount: w.employees.length,
      assignedEmployeeNames: w.employees.map((e) => e.employeeNameSnapshot || (e.employeeId as any)?.name || 'Unknown').slice(0, 3),
      startDate: w.overallStartDate,
      endDate: w.overallEndDate,
      durationDays: calculateWorkingDays(w.overallStartDate, w.overallEndDate),
      status: w.status,
    }));

    const formattedRecentCompanies = recentCompanies.map((c) => ({
      _id: c._id,
      companyName: c.companyName,
      companyType: c.companyType,
      ownerName: c.ownerName,
      location: (c.locationId as any)?.name || 'Unknown',
      profileImage: c.profileImage,
      createdAt: c.createdAt,
    }));

    const formattedRecentWorks = recentWorks.map((w) => ({
      _id: w._id,
      company: (w.companyId as any)?.companyName || 'Unknown',
      location: (w.locationId as any)?.name || 'Unknown',
      employeeCount: w.employees.length,
      status: w.status,
      createdAt: w.createdAt,
    }));

    return {
      stats: {
        totalCompanies,
        totalEmployees,
        activeEmployees: activeEmployeesCount,
        ongoingWorks: ongoingWorksCount,
        completedWorks: completedWorksCount,
        availableEmployees: availableEmployeesCount,
      },
      activeWorks: formattedActiveWorks,
      recentCompanies: formattedRecentCompanies,
      recentWorks: formattedRecentWorks,
    };
  }
}
