import { Request, Response } from 'express';
import { CompanyService } from '../services/company.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class CompanyController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string;
    const locationId = req.query.locationId as string;
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);

    const result = await CompanyService.getAll(search, locationId, page, limit);
    res.json(ApiResponse.paginated(result.data, result.pagination, 'Companies fetched successfully'));
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const data = await CompanyService.getById(req.params.id);
    res.json(ApiResponse.success(data, 'Company details fetched successfully'));
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const payload = { ...req.body };
    if (req.file) {
      payload.profileImage = `/uploads/company-profiles/${req.file.filename}`;
    }

    const company = await CompanyService.create(payload);
    res.status(201).json(ApiResponse.success(company, 'Company created successfully', 201));
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const payload = { ...req.body };
    if (req.file) {
      payload.profileImage = `/uploads/company-profiles/${req.file.filename}`;
    }

    const company = await CompanyService.update(req.params.id, payload);
    res.json(ApiResponse.success(company, 'Company updated successfully'));
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await CompanyService.delete(req.params.id);
    res.json(ApiResponse.success(result, 'Company deleted successfully'));
  });

  static getWorkHistory = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);

    const result = await CompanyService.getWorkHistory(req.params.id, page, limit);
    res.json(ApiResponse.paginated(result.data, result.pagination, 'Company work history fetched successfully'));
  });

  static bulkImport = asyncHandler(async (req: Request, res: Response) => {
    const companies = req.body.companies || req.body;
    const result = await CompanyService.bulkImport(companies);
    res.status(201).json(ApiResponse.success(result, `Successfully imported ${result.importedCount} companies`));
  });
}
