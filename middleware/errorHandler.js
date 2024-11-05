// Error-handling middleware function for Express.js applications
function errorHandler(err, req, res, next) {
  // Determine the HTTP status code; default to 500 for internal server errors
  const statusCode = err.status || 500;

  // Set a default error message if none is provided
  const message = err.message || 'An unexpected error occurred';

  // Log the error with a timestamp for easier debugging and tracking
  console.error(`[${new Date().toISOString()}] - ${message}`);

  // Send the error response as a JSON object with the status code and message
  res.status(statusCode).json({ error: message });
}

// Export the errorHandler function so it can be used in other modules
module.exports = errorHandler;
