export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate field value entered',
        field: err.keyValue,
      });
    }
  
    // MongoDB validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        message: messages.join(', '),
      });
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token',
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired',
      });
    }
  
    res.status(statusCode).json({
      message: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  console.log('Error middleware created');