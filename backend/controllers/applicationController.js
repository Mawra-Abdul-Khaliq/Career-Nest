// import Application from '../models/Application.js';
// import Job from '../models/Job.js';
// import { uploadToCloudinary } from '../utils/cloudinary.js';

// // @desc    Apply for a job
// // @route   POST /api/applications/:jobId
// // @access  Private
// export const applyForJob = async (req, res, next) => {
//   try {
//     const { jobId } = req.params;
//     const { coverLetter } = req.body;

//     // Check if job exists
//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res.status(404).json({ message: 'Job not found' });
//     }

//     // Check if job is still active
//     if (!job.isActive) {
//       return res.status(400).json({ message: 'This job is no longer active' });
//     }

//     // Check if user has already applied
//     const existingApplication = await Application.findOne({
//       job: jobId,
//       applicant: req.user._id,
//     });

//     if (existingApplication) {
//       return res.status(400).json({ message: 'You have already applied for this job' });
//     }

//     let resumeData = {};

//     // If resume is uploaded with the application
//     if (req.file) {
//       const result = await uploadToCloudinary(req.file);
//       resumeData = {
//         url: result.url,
//         publicId: result.publicId,
//       };
//     } else if (req.user.resume && req.user.resume.url) {
//       // Use the resume from user profile
//       resumeData = req.user.resume;
//     } else {
//       return res.status(400).json({ message: 'Please upload a resume' });
//     }

//     // Create application
//     const application = await Application.create({
//       job: jobId,
//       applicant: req.user._id,
//       resume: resumeData,
//       coverLetter,
//       status: 'pending',
//     });

//     // Increment applications count for the job
//     job.applicationsCount += 1;
//     await job.save();

//     res.status(201).json(application);
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get user's applications
// // @route   GET /api/applications/me
// // @access  Private
// export const getUserApplications = async (req, res, next) => {
//   try {
//     const applications = await Application.find({ applicant: req.user._id })
//       .populate('job', 'title company location')
//       .sort({ createdAt: -1 });

//     res.json(applications);
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get application by ID
// // @route   GET /api/applications/:id
// // @access  Private
// export const getApplicationById = async (req, res, next) => {
//   try {
//     const application = await Application.findById(req.params.id)
//       .populate('job')
//       .populate('applicant', 'name email');

//     if (!application) {
//       return res.status(404).json({ message: 'Application not found' });
//     }

//     // Check if user is the applicant or the job poster or admin
//     const job = await Job.findById(application.job);
    
//     if (
//       application.applicant._id.toString() !== req.user._id.toString() &&
//       job.postedBy.toString() !== req.user._id.toString() &&
//       req.user.role !== 'admin'
//     ) {
//       return res.status(403).json({
//         message: 'Not authorized to view this application',
//       });
//     }

//     res.json(application);
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Update application status (for employers/admins)
// // @route   PUT /api/applications/:id/status
// // @access  Private/Admin/Employer
// export const updateApplicationStatus = async (req, res, next) => {
//   try {
//     const { status, notes } = req.body;
    
//     const application = await Application.findById(req.params.id);
    
//     if (!application) {
//       return res.status(404).json({ message: 'Application not found' });
//     }

//     // Check if user is the job poster or admin
//     const job = await Job.findById(application.job);
    
//     if (
//       job.postedBy.toString() !== req.user._id.toString() &&
//       req.user.role !== 'admin'
//     ) {
//       return res.status(403).json({
//         message: 'Not authorized to update this application',
//       });
//     }

//     // Update application
//     application.status = status || application.status;
//     application.notes = notes || application.notes;
    
//     const updatedApplication = await application.save();

//     res.json(updatedApplication);
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Withdraw application (for applicants)
// // @route   DELETE /api/applications/:id
// // @access  Private
// export const withdrawApplication = async (req, res, next) => {
//   try {
//     const application = await Application.findById(req.params.id);
    
//     if (!application) {
//       return res.status(404).json({ message: 'Application not found' });
//     }

//     // Check if user is the applicant
//     if (application.applicant.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         message: 'Not authorized to withdraw this application',
//       });
//     }

//     // Delete application
//     await application.remove();

//     // Decrement applications count for the job
//     const job = await Job.findById(application.job);
//     if (job) {
//       job.applicationsCount = Math.max(0, job.applicationsCount - 1);
//       await job.save();
//     }

//     res.json({ message: 'Application withdrawn successfully' });
//   } catch (error) {
//     next(error);
//   }
// };

// console.log('Application controller created');
import Application from "../models/Application.js"
import Job from "../models/Job.js"
import { StatusCodes } from "http-status-codes"

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params
    const { coverLetter } = req.body

    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" })
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      user: req.user.id,
    })

    if (existingApplication) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "You have already applied for this job" })
    }

    // Create application
    const application = new Application({
      job: jobId,
      user: req.user.id,
      coverLetter,
      resume: req.file ? req.file.path : req.user.resume,
    })

    await application.save()

    res.status(StatusCodes.CREATED).json({ application })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Get user applications
export const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate("job", "title company location")
      .sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json(applications)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("job").populate("user", "name email")

    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Application not found" })
    }

    const job = await Job.findById(application.job)

    // Check if user is authorized to view this application
    if (
      application.user._id.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      job.postedBy.toString() !== req.user.id
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authorized to view this application" })
    }

    res.status(StatusCodes.OK).json(application)
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

    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Application not found" })
    }

    // Check if user is authorized to update this application
    const job = await Job.findById(application.job)

    if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authorized to update this application" })
    }

    application.status = status
    await application.save()

    res.status(StatusCodes.OK).json(application)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Withdraw application
export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Application not found" })
    }

    // Check if user is authorized to withdraw this application
    if (application.user.toString() !== req.user.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authorized to withdraw this application" })
    }

    // Only allow withdrawal if status is pending
    if (application.status !== "pending") {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Cannot withdraw application at this stage" })
    }

    await application.remove()

    res.status(StatusCodes.OK).json({ message: "Application withdrawn successfully" })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}
