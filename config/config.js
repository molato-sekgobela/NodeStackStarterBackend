// Load environment variables from a .env file into process.env
require('dotenv').config();

// Define a list of required environment variables
const requiredEnvVariables = ['DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'JWT_SECRET'];

// Verify that each required environment variable is set; throw an error if any are missing
requiredEnvVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Environment variable ${variable} is required but was not provided`);
  }
});

// Export configuration settings, organizing them for easy access in other modules
module.exports = {
  // Database configuration settings
  database: {
    name: process.env.DB_NAME,               // Database name
    user: process.env.DB_USER,               // Database username
    password: process.env.DB_PASS,           // Database password
    host: process.env.DB_HOST,               // Database host (e.g., RDS endpoint)
    dialect: 'postgres',                     // Database dialect, 'postgres' for PostgreSQL
    port: process.env.DB_PORT || 5432,       // Database port, default to 5432 if not provided
  },

  // JWT secret for token encryption
  jwtSecret: process.env.JWT_SECRET,         // Secret key used for signing JWTs
};
