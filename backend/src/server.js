require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const authRoutes = require('./controllers/authController');
const taskRoutes = require('./controllers/taskController');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // For development, allow any origin. In production, restrict to frontend URL.
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect Database
connectDB();

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running correctly.' });
});

// Authentication Routes
app.post('/api/auth/register', authRoutes.register);
app.post('/api/auth/login', authRoutes.login);
app.get('/api/auth/me', authMiddleware, authRoutes.getMe);

// Task Routes
app.get('/api/tasks', authMiddleware, taskRoutes.getTasks);
app.post('/api/tasks', authMiddleware, taskRoutes.createTask);
app.put('/api/tasks/:id', authMiddleware, taskRoutes.updateTask);
app.delete('/api/tasks/:id', authMiddleware, taskRoutes.deleteTask);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error occurred.' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
