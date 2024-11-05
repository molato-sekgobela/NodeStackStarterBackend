const express = require('express');
const authenticateToken = require('../middleware/auth'); // Middleware to authenticate JWT token
const User = require('../models/User'); // User model to interact with the database

const router = express.Router();

// Route: Get User Profile
// Access: Authenticated users
// Description: Fetches the profile of the authenticated user
router.get('/profile', authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.user.id); // Find user by ID from the JWT payload
  res.json(user); // Respond with user profile data in JSON format
});

// Route: Update User Profile
// Access: Authenticated users
// Description: Allows the user to update their email and surname
router.put('/update', authenticateToken, async (req, res) => {
  const userId = req.user.id; // User ID from the JWT payload
  const { email, surname } = req.body; // Fields allowed to be updated

  try {
    const user = await User.findByPk(userId); // Fetch user from the database
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update only the fields that are provided in the request
    if (email) user.email = email;
    if (surname) user.surname = surname;

    await user.save(); // Save changes to the database
    res.json({ message: 'Profile updated successfully!', user }); // Respond with updated user data
  } catch (error) {
    console.error(error); // Log any errors for debugging
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 error if something goes wrong
  }
});

// Route: Admin - List All Users
// Access: Admin users only
// Description: Fetches a list of all users in the system
router.get('/admin', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });
  const users = await User.findAll(); // Fetch all users from the database
  res.json(users); // Respond with the list of users
});

// Route: Delete User
// Access: Admin users only
// Description: Allows an admin to delete a user by their ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id; // User ID from request parameters
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });
  
  await User.destroy({ where: { id: userId } }); // Delete user from the database
  res.status(204).send(); // Respond with 204 No Content to indicate successful deletion
});

// Route: Update User Role
// Access: Admin users only
// Description: Allows an admin to update a user's role
router.put('/:id/role', authenticateToken, async (req, res) => {
  const userId = req.params.id; // User ID from request parameters
  const { role } = req.body; // New role provided in the request body
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });

  const user = await User.findByPk(userId); // Find user by ID
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.role = role; // Update user's role
  await user.save(); // Save changes to the database
  res.json({ role: user.role }); // Respond with the updated role
});

module.exports = router; // Export the router for use in other parts of the application
