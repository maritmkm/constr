import { Router } from 'express';
import { OngoingWorkController } from '../controllers/ongoingWork.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ongoingWorkSchema } from '../validators/ongoingWork.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', OngoingWorkController.getAll);
router.get('/:id', OngoingWorkController.getById);
router.post('/', validate(ongoingWorkSchema), OngoingWorkController.create);
router.post('/:id/complete', OngoingWorkController.completeWork);
router.post('/:id/cancel', OngoingWorkController.cancelWork);
router.delete('/:id', OngoingWorkController.delete);

export default router;
