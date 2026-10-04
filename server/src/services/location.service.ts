import { Location } from '../models/Location.js';
import { Company } from '../models/Company.js';
import { Employee } from '../models/Employee.js';
import { ApiError } from '../utils/apiError.js';

export class LocationService {
  static async getAll(search?: string, page = 1, limit = 20) {
    const query: any = { isDeleted: false };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const [locations, total] = await Promise.all([
      Location.find(query).sort({ name: 1 }).skip(skip).limit(limit),
      Location.countDocuments(query),
    ]);

    return {
      data: locations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getById(id: string) {
    const location = await Location.findOne({ _id: id, isDeleted: false });
    if (!location) throw new ApiError(404, 'Location not found');
    return location;
  }

  static async create(name: string) {
    const existing = await Location.findOne({
      name: { $regex: `^${name.trim()}$`, $options: 'i' },
      isDeleted: false,
    });
    if (existing) {
      throw new ApiError(409, 'Location with this name already exists');
    }

    const location = await Location.create({ name: name.trim() });
    return location;
  }

  static async update(id: string, name: string) {
    const existing = await Location.findOne({
      _id: { $ne: id },
      name: { $regex: `^${name.trim()}$`, $options: 'i' },
      isDeleted: false,
    });
    if (existing) {
      throw new ApiError(409, 'Another location with this name already exists');
    }

    const location = await Location.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { name: name.trim() },
      { new: true }
    );
    if (!location) throw new ApiError(404, 'Location not found');
    return location;
  }

  static async delete(id: string) {
    const location = await Location.findOne({ _id: id, isDeleted: false });
    if (!location) throw new ApiError(404, 'Location not found');

    const [companyCount, employeeCount] = await Promise.all([
      Company.countDocuments({ locationId: id, isDeleted: false }),
      Employee.countDocuments({ locationId: id, isDeleted: false }),
    ]);

    if (companyCount > 0 || employeeCount > 0) {
      // Perform soft delete
      location.isDeleted = true;
      await location.save();
    } else {
      await Location.findByIdAndDelete(id);
    }
    return { message: 'Location deleted successfully' };
  }
}
