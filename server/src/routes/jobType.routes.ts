import { Router } from 'express';
import { JobTypeController } from '../controllers/jobType.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { jobTypeSchema } from '../validators/jobType.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', JobTypeController.getAll);
router.get('/:id', JobTypeController.getById);
router.post('/', validate(jobTypeSchema), JobTypeController.create);
router.patch('/:id', validate(jobTypeSchema), JobTypeController.update);
router.delete('/:id', JobTypeController.delete);

export default router;
