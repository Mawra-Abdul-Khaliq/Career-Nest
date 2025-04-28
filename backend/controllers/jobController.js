import Job from '../models/Job.js';
import Application from '../models/Application.js';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Admin/Employer
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      description,
      requirements,
      location,
      salary,
      jobType,
      techStack,
      experience,
      applicationDeadline,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      postedBy: req.user._id,
      description,
      requirements,
      location,
      salary,
      jobType,
      techStack: techStack || [],
      experience,
      applicationDeadline,
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs with filtering
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      company,
      techStack,
      jobType,
      page = 1,
      limit = 10,
    } = req.query;

    const queryObject = { isActive: true };

    // Search functionality
    if (search) {
      queryObject.$text = { $search: search };
    }

    // Filter by location
    if (location) {
      queryObject.location = { $regex: location, $options: 'i' };
    }

    // Filter by company
    if (company) {
      queryObject.company = { $regex: company, $options: 'i' };
    }

    // Filter by tech stack
    if (techStack) {
      const techStackArray = techStack.split(',');
      queryObject.techStack = { $in: techStackArray };
    }

    // Filter by job type
    if (jobType) {
      queryObject.jobType = jobType;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(queryObject)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('postedBy', 'name');

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(queryObject);

    res.json({
      jobs,
      page: parseInt(page),
      pages: Math.ceil(totalJobs / parseInt(limit)),
      total: totalJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'postedBy',
      'name email'
    );

    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Admin/Employer
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job poster or an admin
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Not authorized to update this job',
      });
    }

    // Update job fields
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedJob);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin/Employer
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job poster or an admin
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Not authorized to delete this job',
      });
    }

    // Delete all applications for this job
    await Application.deleteMany({ job: req.params.id });

    // Delete the job
    await job.remove();

    res.json({ message: 'Job removed' });
  } catch (error) {
    next(error);
  }
};

console.log('Job controller created');