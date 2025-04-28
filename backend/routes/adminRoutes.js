import express from 'express';
import { 
  getJobApplications, 
  getDashboardStats, 
  getAllUsers, 
  updateUserRole 
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and require admin/employer role
router.use(protect);
router.use(admin);

router.get('/jobs/:jobId/applications', getJobApplications);
router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

export default router;

console.log('Admin routes created');