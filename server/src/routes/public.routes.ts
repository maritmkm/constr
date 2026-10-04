import { Router } from 'express';
import { PublicController } from '../controllers/public.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { employeeSchema } from '../validators/employee.validator.js';

const router = Router();

// Public routes - no authentication required
router.get('/options', PublicController.getPublicOptions);
router.post('/register-employee', validate(employeeSchema), PublicController.registerEmployee);

export default router;
