import { Router } from 'express';
import { LocationController } from '../controllers/location.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { locationSchema } from '../validators/location.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', LocationController.getAll);
router.get('/:id', LocationController.getById);
router.post('/', validate(locationSchema), LocationController.create);
router.patch('/:id', validate(locationSchema), LocationController.update);
router.delete('/:id', LocationController.delete);

export default router;
