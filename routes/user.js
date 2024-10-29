const express = require('express');
const authenticateToken = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get User Profile Route
router.get('/profile', authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json(user);
});

// Admin Route - List All Users
router.get('/admin', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });
  const users = await User.findAll();
  res.json(users);
});

module.exports = router;
