import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class DashboardController {
  static getSummary = asyncHandler(async (_req: Request, res: Response) => {
    const summary = await DashboardService.getSummary();
    res.json(ApiResponse.success(summary, 'Dashboard summary fetched successfully'));
  });
}
