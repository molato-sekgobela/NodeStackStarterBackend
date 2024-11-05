const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const passwordRoutes = require('./routes/password');

const app = express();
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
}));

// Route setup
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/password', passwordRoutes);

// Database sync and server start
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}).catch((err) => console.error('Database connection failed:', err));
