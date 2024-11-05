// Import required modules
const { Sequelize } = require('sequelize'); // Sequelize ORM for database connection and management
const { database } = require('./config');   // Configuration file that holds database credentials
const logger = require('./logger');         // Custom logger module to log messages
const fs = require('fs');                   // File system module to read the SSL certificate
const path = require('path');               // Path module to resolve file paths

// Read the SSL certificate file to establish an encrypted connection to RDS
// Replace 'us-east-1-bundle.pem' with the correct path to your RDS certificate file
const sslCert = fs.readFileSync(path.resolve(__dirname, 'us-east-1-bundle.pem'));

// Initialize Sequelize instance with database credentials and connection options
const sequelize = new Sequelize(
  database.name,             // Database name
  database.user,             // Database username
  database.password,         // Database password
  {
    host: database.host,     // Database host, typically the RDS endpoint
    dialect: database.dialect, // Database dialect, e.g., 'postgres'
    port: database.port,     // Database port, typically 5432 for PostgreSQL

    // Custom logging function that passes Sequelize logs to our logger
    logging: (msg) => logger.info(msg),

    // Additional options for SSL configuration to enable encrypted connection
    dialectOptions: {
      ssl: {
        require: true,       // Enforce SSL for secure connection
        ca: sslCert,         // Use the RDS SSL certificate to verify the server's identity
      },
    },
  }
);

// Test the connection to the database
sequelize.authenticate()
  .then(() => logger.info('Database connection established')) // Log success message on successful connection
  .catch((err) => logger.error('Database connection failed:', err)); // Log error details if connection fails

// Export the configured Sequelize instance for use in other parts of the application
module.exports = sequelize;
