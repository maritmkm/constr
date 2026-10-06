import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { uploadCompanyProfile } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { companySchema } from '../validators/company.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', CompanyController.getAll);
router.post('/bulk-import', CompanyController.bulkImport);
router.get('/:id', CompanyController.getById);
router.get('/:id/work-history', CompanyController.getWorkHistory);

router.post(
  '/',
  uploadCompanyProfile.single('profile'),
  validate(companySchema),
  CompanyController.create
);

router.patch(
  '/:id',
  uploadCompanyProfile.single('profile'),
  CompanyController.update
);

router.delete('/:id', CompanyController.delete);

export default router;
