// import User from '../models/User.js';
// import { generateToken } from '../utils/jwt.utils.js';

// // @desc    Register a new user
// // @route   POST /api/auth/register
// // @access  Public
// export const register = async (req, res, next) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Check if user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create new user
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: role || 'user', // Default to 'user' if role not provided
//     });

//     if (user) {
//       res.status(201).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(400).json({ message: 'Invalid user data' });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });

//     // Check if user exists and password matches
//     if (user && (await user.comparePassword(password))) {
//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         profilePicture: user.profilePicture,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get current user profile
// // @route   GET /api/auth/profile
// // @access  Private
// export const getUserProfile = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
    
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// console.log('Auth controller created');

import User from "../models/User.js"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" })
    }

    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" })
    }

    // Update fields
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.phone = req.body.phone || user.phone
    user.location = req.body.location || user.location
    user.bio = req.body.bio || user.bio
    user.skills = req.body.skills || user.skills
    user.education = req.body.education || user.education
    user.experience = req.body.experience || user.experience
    user.linkedin = req.body.linkedin || user.linkedin
    user.github = req.body.github || user.github
    user.website = req.body.website || user.website

    // If user is updating password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(req.body.password, salt)
    }

    const updatedUser = await user.save()

    res.status(StatusCodes.OK).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      location: updatedUser.location,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      education: updatedUser.education,
      experience: updatedUser.experience,
      linkedin: updatedUser.linkedin,
      github: updatedUser.github,
      website: updatedUser.website,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    })

    if (user) {
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      })

      res.status(StatusCodes.CREATED).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid user data" })
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password" })
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    })

    res.status(StatusCodes.OK).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" })
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    // Save reset token to user
    user.resetPasswordToken = resetToken
    user.resetPasswordExpire = Date.now() + 3600000 // 1 hour
    await user.save()

    // In a real application, send email with reset link
    // For now, just return the token
    res.status(StatusCodes.OK).json({
      message: "Password reset email sent",
      resetToken,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find user
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid or expired token" })
    }

    // Update password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.status(StatusCodes.OK).json({ message: "Password reset successful" })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}
