import express from "express"
import {
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  getEmployerJobById,
  getJobApplications,
  getEmployerDashboardStats,
  updateApplicationStatus,
  getEmployerApplications, // Added missing import
} from "../controllers/employerController.js"
import { protect, employer } from "../middleware/authMiddleware.js"

const router = express.Router()

// All routes are protected and require employer role
router.use(protect)
router.use(employer)

// Job management routes
router.post("/jobs", createJob)
router.get("/jobs", getEmployerJobs)
router.get("/jobs/:id", getEmployerJobById)
router.put("/jobs/:id", updateJob)
router.delete("/jobs/:id", deleteJob)

// Application management routes
router.get("/applications", getEmployerApplications)
router.get("/jobs/:jobId/applications", getJobApplications)
router.put("/applications/:id/status", updateApplicationStatus)

// Dashboard statistics
router.get("/dashboard", getEmployerDashboardStats)

export default router

console.log("Employer routes created")
