const express = require('express');
const authenticateToken = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get User Profile Route
router.get('/profile', authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json(user);
});

// Update User Profile Route
router.put('/update', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { email, surname } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update user fields
    if (email) user.email = email; // Only update if provided
    if (surname) user.surname = surname; // Only update if provided

    await user.save();
    res.json({ message: 'Profile updated successfully!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Route - List All Users
router.get('/admin', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });
  const users = await User.findAll();
  res.json(users);
});

// Delete User Route
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });
  await User.destroy({ where: { id: userId } });
  res.status(204).send(); // No content
});

// Update User Role Route
router.put('/:id/role', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });

  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.role = role;
  await user.save();
  res.json({ role: user.role });
});

module.exports = router;
