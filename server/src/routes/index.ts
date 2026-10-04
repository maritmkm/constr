import { Router } from 'express';
import authRoutes from './auth.routes.js';
import locationRoutes from './location.routes.js';
import jobTypeRoutes from './jobType.routes.js';
import companyRoutes from './company.routes.js';
import employeeRoutes from './employee.routes.js';
import ongoingWorkRoutes from './ongoingWork.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import publicRoutes from './public.routes.js';

const router = Router();

router.use('/public', publicRoutes);
router.use('/auth', authRoutes);
router.use('/locations', locationRoutes);
router.use('/job-types', jobTypeRoutes);
router.use('/companies', companyRoutes);
router.use('/employees', employeeRoutes);
router.use('/ongoing-works', ongoingWorkRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
