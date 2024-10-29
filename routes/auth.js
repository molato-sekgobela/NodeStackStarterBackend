const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, surname, email, password: hashedPassword });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, surname: user.surname, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, surname: user.surname, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in user' });
  }
});

module.exports = router;
