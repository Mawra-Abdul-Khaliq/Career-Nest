import User from '../models/User.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { generateToken } from '../utils/jwt.utils.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.skills = req.body.skills || user.skills;
      user.education = req.body.education || user.education;
      user.experience = req.body.experience || user.experience;
      
      // Only update password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        skills: updatedUser.skills,
        education: updatedUser.education,
        experience: updatedUser.experience,
        profilePicture: updatedUser.profilePicture,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/users/resume
// @access  Private
export const uploadResume = async (req, res, next) => {
    try {
      console.log('🔥 Incoming file:', req.file);
  
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
      }
  
      const user = await User.findById(req.user._id);
      console.log('👤 Current User:', user);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete old resume from Cloudinary
      if (user.resume?.publicId) {
        console.log('🗑️ Deleting old resume:', user.resume.publicId);
        await deleteFromCloudinary(user.resume.publicId);
      }
  
      // Save new resume
      user.resume = {
        url: req.file.path,
        publicId: req.file.filename,
      };
  
      await user.save();
  
      res.status(200).json({
        message: 'Resume uploaded successfully',
        resume: user.resume,
      });
    } catch (error) {
        console.error(' Upload Resume Error:', error); // Full error in terminal
      
        // Temporarily include full error in response to debug
        res.status(500).json({ 
          message: 'Server Error',
          fullError: error, // Add this
          errorMessage: error.message 
        });
      }      
  };
  
// export const uploadResume = async (req, res, next) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ message: 'Please upload a file' });
//       }
  
//       const user = await User.findById(req.user._id);
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Delete old resume from Cloudinary (if any)
//       if (user.resume && user.resume.publicId) {
//         await deleteFromCloudinary(user.resume.publicId);
//       }
  
//       // Save new resume from multer's Cloudinary response
//       user.resume = {
//         url: req.file.path, // this is already Cloudinary URL
//         publicId: req.file.filename, // this is Cloudinary public ID
//       };
  
//       await user.save();
  
//       res.json({
//         message: 'Resume uploaded successfully',
//         resume: user.resume,
//       });
//     } catch (error) {
//       next(error);
//     }
//   };
  
// @desc    Save a job
// @route   POST /api/users/jobs/:id/save
// @access  Private
export const saveJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if job is already saved
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    // Add job to saved jobs
    user.savedJobs.push(jobId);
    await user.save();

    res.json({
      message: 'Job saved successfully',
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsave a job
// @route   DELETE /api/users/jobs/:id/save
// @access  Private
export const unsaveJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove job from saved jobs
    user.savedJobs = user.savedJobs.filter(
      (id) => id.toString() !== jobId
    );
    await user.save();

    res.json({
      message: 'Job removed from saved jobs',
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved jobs
// @route   GET /api/users/jobs/saved
// @access  Private
export const getSavedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.savedJobs);
  } catch (error) {
    next(error);
  }
};

console.log('User controller created');

// import User from "../models/User.js"
// import Job from "../models/Job.js"
// import { StatusCodes } from "http-status-codes"

// // Get user profile
// export const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password")

//     if (!user) {
//       return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" })
//     }

//     res.status(StatusCodes.OK).json(user)
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
//   }
// }

// // Update user profile
// export const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)

//     if (!user) {
//       return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" })
//     }

//     // Update fields
//     user.name = req.body.name || user.name
//     user.location = req.body.location || user.location
//     user.bio = req.body.bio || user.bio
//     user.skills = req.body.skills || user.skills
//     user.education = req.body.education || user.education
//     user.experience = req.body.experience || user.experience

//     const updatedUser = await user.save()

//     res.status(StatusCodes.OK).json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       location: updatedUser.location,
//       bio: updatedUser.bio,
//       skills: updatedUser.skills,
//       education: updatedUser.education,
//       experience: updatedUser.experience,
//     })
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
//   }
// }

// // Save a job
// export const saveJob = async (req, res) => {
//   try {
//     const jobId = req.params.jobId

//     // Check if job exists
//     const job = await Job.findById(jobId)
//     if (!job) {
//       return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" })
//     }

//     const user = await User.findById(req.user.id)

//     // Check if job is already saved
//     if (user.savedJobs.includes(jobId)) {
//       return res.status(StatusCodes.BAD_REQUEST).json({ message: "Job already saved" })
//     }

//     // Add job to saved jobs
//     user.savedJobs.push(jobId)
//     await user.save()

//     res.status(StatusCodes.OK).json({ message: "Job saved successfully" })
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
//   }
// }

// // Unsave a job
// export const unsaveJob = async (req, res) => {
//   try {
//     const jobId = req.params.jobId

//     const user = await User.findById(req.user.id)

//     // Check if job is saved
//     if (!user.savedJobs.includes(jobId)) {
//       return res.status(StatusCodes.BAD_REQUEST).json({ message: "Job not saved" })
//     }

//     // Remove job from saved jobs
//     user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId)
//     await user.save()

//     res.status(StatusCodes.OK).json({ message: "Job removed from saved jobs" })
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
//   }
// }

// // Get saved jobs
// export const getSavedJobs = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate("savedJobs")

//     if (!user) {
//       return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" })
//     }

//     res.status(StatusCodes.OK).json(user.savedJobs)
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
//   }
// }
