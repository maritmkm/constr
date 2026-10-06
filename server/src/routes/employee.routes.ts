import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { employeeSchema } from '../validators/employee.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', EmployeeController.getAll);
router.post('/bulk-import', EmployeeController.bulkImport);
router.get('/:id', EmployeeController.getById);
router.post('/', validate(employeeSchema), EmployeeController.create);
router.patch('/:id', validate(employeeSchema), EmployeeController.update);
router.delete('/:id', EmployeeController.delete);

export default router;
