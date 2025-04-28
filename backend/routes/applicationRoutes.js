// import express from 'express';
// import { 
//   applyForJob, 
//   getUserApplications, 
//   getApplicationById, 
//   updateApplicationStatus, 
//   withdrawApplication 
// } from '../controllers/applicationController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';
// import { upload } from '../utils/cloudinary.js';

// const router = express.Router();

// // All routes are protected
// router.use(protect);

// router.post('/:jobId', upload.single('resume'), applyForJob);
// router.get('/me', getUserApplications);
// router.get('/:id', getApplicationById);
// router.put('/:id/status', admin, updateApplicationStatus);
// router.delete('/:id', withdrawApplication);

// export default router;

// console.log('Application routes created');

import express from "express"
import {
  applyForJob,
  getUserApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
} from "../controllers/applicationController.js"
import { protect, admin } from "../middleware/authMiddleware.js"
import { upload } from "../utils/cloudinary.js"

const router = express.Router()

// All routes are protected
router.use(protect)

router.post("/:jobId", upload.single("resume"), applyForJob)
router.get("/me", getUserApplications)
router.get("/:id", getApplicationById)
router.put("/:id/status", admin, updateApplicationStatus)
router.delete("/:id", withdrawApplication)

export default router

console.log("Application routes created")
