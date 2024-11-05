function errorHandler(err, req, res, next) {
    const statusCode = err.status || 500;
    const message = err.message || 'An unexpected error occurred';
    
    console.error(`[${new Date().toISOString()}] - ${message}`);
    res.status(statusCode).json({ error: message });
  }
  
  module.exports = errorHandler;
  