const express = require('express');
const bcrypt = require('bcryptjs'); // Used for hashing passwords
const jwt = require('jsonwebtoken'); // Used for generating JSON Web Tokens
const User = require('../models/User'); // User model for database interaction
const { jwtSecret } = require('../config/config'); // Secret key for JWTs from config
const logger = require('../config/logger'); // Logger for error and activity logging

const router = express.Router();

// Route: User Registration
// Access: Public
// Description: Registers a new user and returns a JWT token
router.post('/register', async (req, res, next) => {
  const { name, surname, email, password } = req.body;

  // Check if all required fields are provided
  if (!name || !surname || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    // Hash the user's password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const user = await User.create({ name, surname, email, password: hashedPassword });

    // Generate a JWT token that expires in 1 hour
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });

    // Respond with success, the JWT token, and basic user information
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, surname: user.surname, email: user.email, role: user.role },
    });
  } catch (error) {
    // Handle unique constraint error (e.g., duplicate email)
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email is already in use' });
    } else {
      logger.error('Error registering user:', error); // Log unexpected errors
      next(error); // Pass to global error handler
    }
  }
});

// Route: User Login
// Access: Public
// Description: Logs in a user and returns a JWT token
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    // Look for a user with the given email
    const user = await User.findOne({ where: { email } });

    // If user not found or password does not match, return unauthorized error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token that expires in 1 hour
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });

    // Respond with success, the JWT token, and basic user information
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, surname: user.surname, email: user.email, role: user.role },
    });
  } catch (error) {
    logger.error('Error logging in user:', error); // Log unexpected errors
    next(error); // Pass to global error handler
  }
});

module.exports = router; // Export router to be used in other parts of the app
