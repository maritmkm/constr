import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export class AuthService {
  static async ensureAdminExists() {
    const count = await Admin.countDocuments();
    if (count === 0) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await Admin.create({
        name: 'System Admin',
        email: 'admin@example.com',
        passwordHash,
      });
      console.log('✓ Auto-created default admin: admin@example.com / admin123');
    }
  }

  static async login(email: string, password: string) {
    // Ensure admin user exists in DB
    await AuthService.ensureAdminExists();

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    };
  }

  static async getMe(id: string) {
    const admin = await Admin.findById(id).select('-passwordHash');
    if (!admin) {
      throw new ApiError(404, 'User not found');
    }
    return admin;
  }
}
