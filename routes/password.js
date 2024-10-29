const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Password Recovery Route
router.post('/recover', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ message: 'Password recovery initiated', token });
  } catch (error) {
    res.status(500).json({ error: 'Error initiating password recovery' });
  }
});

// Password Reset Route
router.post('/reset', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update({ password: hashedPassword }, { where: { id: payload.id } });
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
