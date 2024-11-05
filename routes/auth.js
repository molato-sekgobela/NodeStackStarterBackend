const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/config');
const logger = require('../config/logger');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, surname, email, password: hashedPassword });

    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, surname: user.surname, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email is already in use' });
    } else {
      logger.error('Error registering user:', error);
      next(error);
    }
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, surname: user.surname, email: user.email, role: user.role },
    });
  } catch (error) {
    logger.error('Error logging in user:', error);
    next(error);
  }
});

module.exports = router;
