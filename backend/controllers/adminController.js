import Job from '../models/Job.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

// @desc    Get all applications for a job
// @route   GET /api/admin/jobs/:jobId/applications
// @access  Private/Admin/Employer
export const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job poster or admin
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Not authorized to view applications for this job',
      });
    }

    // Get applications
    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email skills education experience')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats for admin/employer
// @route   GET /api/admin/dashboard
// @access  Private/Admin/Employer
export const getDashboardStats = async (req, res, next) => {
  try {
    let stats = {};
    
    if (req.user.role === 'admin') {
      // Admin sees all stats
      stats = {
        totalJobs: await Job.countDocuments(),
        activeJobs: await Job.countDocuments({ isActive: true }),
        totalApplications: await Application.countDocuments(),
        totalUsers: await User.countDocuments({ role: 'user' }),
        totalEmployers: await User.countDocuments({ role: 'employer' }),
        pendingApplications: await Application.countDocuments({ status: 'pending' }),
        shortlistedApplications: await Application.countDocuments({ status: 'shortlisted' }),
        rejectedApplications: await Application.countDocuments({ status: 'rejected' }),
        acceptedApplications: await Application.countDocuments({ status: 'accepted' }),
      };
    } else {
      // Employer sees only their stats
      stats = {
        totalJobs: await Job.countDocuments({ postedBy: req.user._id }),
        activeJobs: await Job.countDocuments({ postedBy: req.user._id, isActive: true }),
        // Get all job IDs posted by this employer
        jobIds: (await Job.find({ postedBy: req.user._id }).select('_id')).map(job => job._id),
      };
      
      // Use the job IDs to get application stats
      stats.totalApplications = await Application.countDocuments({ job: { $in: stats.jobIds } });
      stats.pendingApplications = await Application.countDocuments({ 
        job: { $in: stats.jobIds },
        status: 'pending'
      });
      stats.shortlistedApplications = await Application.countDocuments({ 
        job: { $in: stats.jobIds },
        status: 'shortlisted'
      });
      stats.rejectedApplications = await Application.countDocuments({ 
        job: { $in: stats.jobIds },
        status: 'rejected'
      });
      stats.acceptedApplications = await Application.countDocuments({ 
        job: { $in: stats.jobIds },
        status: 'accepted'
      });
      
      // Remove jobIds from response
      delete stats.jobIds;
    }
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    // Only admin can access this
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to access this resource',
      });
    }
    
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    // Only admin can access this
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to access this resource',
      });
    }
    
    const { role } = req.body;
    
    if (!['user', 'employer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

console.log('Admin controller created');