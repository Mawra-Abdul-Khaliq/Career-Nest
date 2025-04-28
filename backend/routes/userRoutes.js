import express from 'express';
import { 
  updateUserProfile, 
  uploadResume, 
  saveJob, 
  unsaveJob, 
  getSavedJobs 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.put('/profile', updateUserProfile);
router.post('/resume', upload.single('resume'), uploadResume);
router.post('/jobs/:id/save', saveJob);
router.delete('/jobs/:id/save', unsaveJob);
router.get('/jobs/saved', getSavedJobs);

export default router;

console.log('User routes created');