import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user is admin
export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'employer')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin or employer' });
  }
};

// Employer middleware
export const employer = (req, res, next) => {
  if (req.user && (req.user.role === "employer" || req.user.role === "admin")) {
    console.log("User authorized as employer"); // Add this for debugging
    next();
  } else {
    console.log("User not authorized as employer. Role:", req.user?.role); // Add this for debugging
    res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized as an employer" });
  }
};
console.log('Auth middleware created');


