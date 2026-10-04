import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class AuthController {
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    // Set cookie for HTTP-only cookie support
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    res.json(ApiResponse.success(result, 'Login successful'));
  });

  static getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const user = await AuthService.getMe(userId);
    res.json(ApiResponse.success(user, 'User details fetched successfully'));
  });

  static logout = asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie('token');
    res.json(ApiResponse.success(null, 'Logged out successfully'));
  });
}
