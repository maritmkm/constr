import { Request, Response } from 'express';
import { OngoingWorkService } from '../services/ongoingWork.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class OngoingWorkController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string;
    const locationId = req.query.locationId as string;
    const jobTypeId = req.query.jobTypeId as string;
    const status = req.query.status as any;
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);

    const result = await OngoingWorkService.getAll({
      search,
      locationId,
      jobTypeId,
      status,
      page,
      limit,
    });

    res.json(ApiResponse.paginated(result.data, result.pagination, 'Ongoing works fetched successfully'));
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const work = await OngoingWorkService.getById(req.params.id);
    res.json(ApiResponse.success(work, 'Ongoing work details fetched successfully'));
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const work = await OngoingWorkService.create(req.body);
    res.status(201).json(ApiResponse.success(work, 'Project assigned successfully', 201));
  });

  static completeWork = asyncHandler(async (req: Request, res: Response) => {
    const result = await OngoingWorkService.completeWork(req.params.id);
    res.json(ApiResponse.success(result, 'Work marked as completed'));
  });

  static cancelWork = asyncHandler(async (req: Request, res: Response) => {
    const result = await OngoingWorkService.cancelWork(req.params.id);
    res.json(ApiResponse.success(result, 'Work cancelled'));
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await OngoingWorkService.delete(req.params.id);
    res.json(ApiResponse.success(result, 'Work deleted successfully'));
  });
}
