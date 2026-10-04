import { Request, Response } from 'express';
import { Location } from '../models/Location.js';
import { JobType } from '../models/JobType.js';
import { EmployeeService } from '../services/employee.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class PublicController {
  static getPublicOptions = asyncHandler(async (req: Request, res: Response) => {
    const [locations, jobTypes] = await Promise.all([
      Location.find({ isDeleted: false }).sort({ name: 1 }),
      JobType.find({ isDeleted: false, status: 'ACTIVE' }).sort({ name: 1 }),
    ]);

    res.json(
      ApiResponse.success(
        { locations, jobTypes },
        'Public options fetched successfully'
      )
    );
  });

  static registerEmployee = asyncHandler(async (req: Request, res: Response) => {
    const employee = await EmployeeService.create(req.body);
    res.status(201).json(
      ApiResponse.success(
        employee,
        'Employee registered successfully! Our team will contact you shortly.',
        201
      )
    );
  });
}
