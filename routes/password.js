const express = require('express');
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const jwt = require('jsonwebtoken'); // Library for creating and verifying JWTs
const User = require('../models/User'); // User model for database interaction
const nodemailer = require('nodemailer'); // Nodemailer for sending recovery emails
require('dotenv').config(); // Load environment variables

const router = express.Router();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email provider (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Route: Password Recovery
// Access: Public
// Description: Initiates password recovery by sending an email with a recovery token
// Password Recovery Route
router.post('/recover', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate token and expiration time
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Save the token and expiration to the database
    await user.update({
      passwordResetToken: token,
      passwordResetExpires: expiresAt,
    });

    const recoveryUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Recovery',
      html: `<p>You requested a password reset.</p><p>Click the link to reset your password: <a href="${recoveryUrl}">${recoveryUrl}</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password recovery email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error initiating password recovery' });
  }
});

// Route: Password Reset
// Access: Public
// Description: Resets the user's password if a valid token is provided
// Password Reset Route
router.post('/reset', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { passwordResetToken: token } });

    if (!user || new Date() > user.passwordResetExpires) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the token fields
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error resetting password' });
  }
});


module.exports = router; // Export the router to use in other parts of the app
