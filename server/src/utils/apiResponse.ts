export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  static success<T>(data: T, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static paginated<T>(data: T[], pagination: PaginationMeta, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      pagination,
    };
  }

  static error(message: string, statusCode = 400, errors: any[] = []) {
    return {
      success: false,
      statusCode,
      message,
      errors,
    };
  }
}
