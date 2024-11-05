// Import the Winston logging library
const winston = require('winston');

// Create a Winston logger instance with customized configurations
const logger = winston.createLogger({
  // Set the logging level. 'info' level will log all messages at 'info' level and higher
  level: 'info',

  // Define the log format as JSON, which is structured and useful for log aggregation systems
  format: winston.format.json(),

  // Set up transports (where logs should be output)
  transports: [
    // Output logs to the console for quick debugging
    new winston.transports.Console(),

    // Save 'error' level logs to a file named 'error.log' for tracking issues
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// Export the logger to be used in other parts of the application
module.exports = logger;
