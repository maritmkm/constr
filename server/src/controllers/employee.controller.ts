import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class EmployeeController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string;
    const locationId = req.query.locationId as string;
    const jobTypeId = req.query.jobTypeId as string;
    const status = req.query.status as string;
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);

    const result = await EmployeeService.getAll({
      search,
      locationId,
      jobTypeId,
      status,
      page,
      limit,
    });

    res.json(ApiResponse.paginated(result.data, result.pagination, 'Employees fetched successfully'));
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const employee = await EmployeeService.getById(req.params.id);
    res.json(ApiResponse.success(employee, 'Employee details fetched successfully'));
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const employee = await EmployeeService.create(req.body);
    res.status(201).json(ApiResponse.success(employee, 'Employee created successfully', 201));
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const employee = await EmployeeService.update(req.params.id, req.body);
    res.json(ApiResponse.success(employee, 'Employee updated successfully'));
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await EmployeeService.delete(req.params.id);
    res.json(ApiResponse.success(result, 'Employee deleted successfully'));
  });

  static bulkImport = asyncHandler(async (req: Request, res: Response) => {
    const employees = req.body.employees || req.body;
    const result = await EmployeeService.bulkImport(employees);
    res.status(201).json(ApiResponse.success(result, `Successfully imported ${result.importedCount} employees`));
  });
}
