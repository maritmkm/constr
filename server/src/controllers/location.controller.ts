import { Request, Response } from 'express';
import { LocationService } from '../services/location.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class LocationController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);

    const result = await LocationService.getAll(search, page, limit);
    res.json(ApiResponse.paginated(result.data, result.pagination, 'Locations fetched successfully'));
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const location = await LocationService.getById(req.params.id);
    res.json(ApiResponse.success(location, 'Location details fetched successfully'));
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    const location = await LocationService.create(name);
    res.status(201).json(ApiResponse.success(location, 'Location created successfully', 201));
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    const location = await LocationService.update(req.params.id, name);
    res.json(ApiResponse.success(location, 'Location updated successfully'));
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await LocationService.delete(req.params.id);
    res.json(ApiResponse.success(result, 'Location deleted successfully'));
  });
}
