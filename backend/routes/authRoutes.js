// import express from 'express';
// import { register, login, getUserProfile } from '../controllers/authController.js';
// import { protect } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // Public routes
// router.post('/register', register);
// router.post('/login', login);

// // Protected routes
// router.get('/profile', protect, getUserProfile);

// export default router;

// console.log('Auth routes created');
import express from "express"
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

// Protected routes
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile)

export default router

console.log("Auth routes created")
