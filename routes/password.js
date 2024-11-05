const express = require('express');
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const jwt = require('jsonwebtoken'); // Library for creating and verifying JWTs
const User = require('../models/User'); // User model for database interaction
require('dotenv').config(); // Load environment variables

const router = express.Router();

// Route: Password Recovery
// Access: Public
// Description: Initiates password recovery by generating a JWT for verification
router.post('/recover', async (req, res) => {
  const { email } = req.body; // Get email from request body

  try {
    // Look for a user with the specified email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate a JWT with the user ID, valid for 15 minutes
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    
    // Send token as a response (in a real application, you’d send this via email)
    res.json({ message: 'Password recovery initiated', token });
  } catch (error) {
    res.status(500).json({ error: 'Error initiating password recovery' }); // Internal error
  }
});

// Route: Password Reset
// Access: Public
// Description: Resets the user's password if a valid token is provided
router.post('/reset', async (req, res) => {
  const { token, newPassword } = req.body; // Get token and new password from request body

  try {
    // Verify the token to get the user ID from the payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Hash the new password before saving to the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await User.update({ password: hashedPassword }, { where: { id: payload.id } });
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token' }); // Handle invalid/expired token error
  }
});

module.exports = router; // Export the router to use in other parts of the app
