import { JobType } from '../models/JobType.js';
import { Employee } from '../models/Employee.js';
import { ApiError } from '../utils/apiError.js';

export class JobTypeService {
  static async getAll(search?: string, page = 1, limit = 20) {
    const query: any = { isDeleted: false };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [jobTypes, total] = await Promise.all([
      JobType.find(query).sort({ name: 1 }).skip(skip).limit(limit),
      JobType.countDocuments(query),
    ]);

    return {
      data: jobTypes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getById(id: string) {
    const jobType = await JobType.findOne({ _id: id, isDeleted: false });
    if (!jobType) throw new ApiError(404, 'Job type not found');
    return jobType;
  }

  static async create(payload: { name: string; description?: string; status?: 'ACTIVE' | 'INACTIVE' }) {
    const existing = await JobType.findOne({
      name: { $regex: `^${payload.name.trim()}$`, $options: 'i' },
      isDeleted: false,
    });
    if (existing) {
      throw new ApiError(409, 'Job type with this name already exists');
    }

    const jobType = await JobType.create({
      name: payload.name.trim(),
      description: payload.description?.trim(),
      status: payload.status || 'ACTIVE',
    });
    return jobType;
  }

  static async update(id: string, payload: { name?: string; description?: string; status?: 'ACTIVE' | 'INACTIVE' }) {
    if (payload.name) {
      const existing = await JobType.findOne({
        _id: { $ne: id },
        name: { $regex: `^${payload.name.trim()}$`, $options: 'i' },
        isDeleted: false,
      });
      if (existing) {
        throw new ApiError(409, 'Another job type with this name already exists');
      }
    }

    const jobType = await JobType.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { ...payload, name: payload.name?.trim() },
      { new: true }
    );
    if (!jobType) throw new ApiError(404, 'Job type not found');
    return jobType;
  }

  static async delete(id: string) {
    const jobType = await JobType.findOne({ _id: id, isDeleted: false });
    if (!jobType) throw new ApiError(404, 'Job type not found');

    const employeeCount = await Employee.countDocuments({ jobTypeId: id, isDeleted: false });
    if (employeeCount > 0) {
      jobType.isDeleted = true;
      await jobType.save();
    } else {
      await JobType.findByIdAndDelete(id);
    }
    return { message: 'Job type deleted successfully' };
  }
}
