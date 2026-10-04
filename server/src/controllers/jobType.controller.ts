import { Request, Response } from 'express';
import { JobTypeService } from '../services/jobType.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class JobTypeController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);

    const result = await JobTypeService.getAll(search, page, limit);
    res.json(ApiResponse.paginated(result.data, result.pagination, 'Job types fetched successfully'));
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const jobType = await JobTypeService.getById(req.params.id);
    res.json(ApiResponse.success(jobType, 'Job type details fetched successfully'));
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const jobType = await JobTypeService.create(req.body);
    res.status(201).json(ApiResponse.success(jobType, 'Job type created successfully', 201));
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const jobType = await JobTypeService.update(req.params.id, req.body);
    res.json(ApiResponse.success(jobType, 'Job type updated successfully'));
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await JobTypeService.delete(req.params.id);
    res.json(ApiResponse.success(result, 'Job type deleted successfully'));
  });
}
