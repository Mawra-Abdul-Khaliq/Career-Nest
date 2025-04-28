import Job from "../models/Job.js"
import Application from "../models/Application.js"
import { StatusCodes } from "http-status-codes"

// Create a new job
export const createJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.user.id,
    })

    await job.save()
    res.status(StatusCodes.CREATED).json({ job })
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
}

// Get all jobs posted by the employer
export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 })

    // Get application count for each job
    const jobsWithApplicationCount = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ job: job._id })
        return {
          ...job.toObject(),
          applicationCount,
        }
      }),
    )

    res.status(StatusCodes.OK).json({ jobs: jobsWithApplicationCount })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Get a specific job by ID
export const getEmployerJobById = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user.id,
    })

    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" })
    }

    const applicationCount = await Application.countDocuments({ job: job._id })

    res.status(StatusCodes.OK).json({
      ...job.toObject(),
      applicationCount,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Update a job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate({ _id: req.params.id, postedBy: req.user.id }, req.body, {
      new: true,
      runValidators: true,
    })

    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" })
    }

    res.status(StatusCodes.OK).json({ job })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
}

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user.id,
    })

    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" })
    }

    // Delete all applications for this job
    await Application.deleteMany({ job: req.params.id })

    res.status(StatusCodes.OK).json({ message: "Job deleted successfully" })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Get all applications for the employer
export const getEmployerApplications = async (req, res) => {
  try {
    // First get all jobs posted by this employer
    const employerJobs = await Job.find({ postedBy: req.user.id }).select("_id")
    const jobIds = employerJobs.map((job) => job._id)

    // Then get all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("job", "title company")
      .populate("user", "name email")
      .sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json(applications)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Get applications for a specific job
export const getJobApplications = async (req, res) => {
  try {
    // Verify the job belongs to this employer
    const job = await Job.findOne({
      _id: req.params.jobId,
      postedBy: req.user.id,
    })

    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" })
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("user", "name email profilePicture resume")
      .sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json(applications)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!["pending", "shortlisted", "rejected", "accepted"].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid status" })
    }

    // Find the application
    const application = await Application.findById(req.params.id).populate("job")

    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Application not found" })
    }

    // Verify the job belongs to this employer
    const job = await Job.findOne({
      _id: application.job._id,
      postedBy: req.user.id,
    })

    if (!job) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authorized to update this application" })
    }

    application.status = status
    await application.save()

    res.status(StatusCodes.OK).json({ application })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Get employer dashboard statistics
export const getEmployerDashboardStats = async (req, res) => {
  try {
    // Get all jobs posted by this employer
    const employerJobs = await Job.find({ postedBy: req.user.id })
    const jobIds = employerJobs.map((job) => job._id)

    // Total jobs count
    const totalJobs = employerJobs.length

    // Active jobs count
    const activeJobs = employerJobs.filter((job) => job.status === "active").length

    // Total applications count
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } })

    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ])

    // Format the applications by status
    const formattedApplicationsByStatus = applicationsByStatus.reduce((acc, curr) => {
      acc[curr._id] = curr.count
      return acc
    }, {})

    // Recent applications
    const recentApplications = await Application.find({ job: { $in: jobIds } })
      .populate("job", "title company")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5)

    // Applications per job
    const applicationsPerJob = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$job", count: { $sum: 1 } } },
    ])

    // Get job details for the applications per job
    const jobDetails = await Job.find({ _id: { $in: applicationsPerJob.map((item) => item._id) } }).select(
      "title company",
    )

    // Map job details to applications per job
    const formattedApplicationsPerJob = applicationsPerJob.map((item) => {
      const job = jobDetails.find((j) => j._id.toString() === item._id.toString())
      return {
        jobId: item._id,
        title: job?.title || "Unknown Job",
        company: job?.company || "Unknown Company",
        applicationCount: item.count,
      }
    })

    res.status(StatusCodes.OK).json({
      totalJobs,
      activeJobs,
      totalApplications,
      applicationsByStatus: formattedApplicationsByStatus,
      recentApplications,
      applicationsPerJob: formattedApplicationsPerJob,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}
