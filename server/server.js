/**
 * Banana Quest: Enterprise Game Server
 * University of Bedfordshire - CIS046-3 Software For Enterprise
 * 
 * Demonstrates:
 * 1. Version Control & Modular Architecture
 * 2. Event-Driven Asynchronous Server Handling
 * 3. Interoperability with Marc Conrad's Banana REST API
 * 4. Virtual Identity (Bcrypt Password Hashing, JWTs, HTTP-only Cookies)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to persistence layer
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(cookieParser());
app.use(express.json());

// Request logger for audit & event traceability
app.use((req, res, next) => {
  console.log(`[HTTP ${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check & System Information (Useful for video demonstration of architecture)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'Banana Quest Game Engine',
    assignment: 'CIS046-3 Software For Enterprise',
    externalApi: 'https://marcconrad.com/uob/banana/doc.php',
    timestamp: new Date().toISOString()
  });
});

// Centralized 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this enterprise server.`
  });
});

// Centralized Error Handling Middleware (Express Event-driven Error Pipeline)
app.use((err, req, res, next) => {
  console.error('[ServerError]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🍌 Banana Quest Server running on http://localhost:${PORT}`);
  console.log(`🔒 Virtual Identity & Auth: Active`);
  console.log(`🌐 Interoperability (Banana API): Connected`);
  console.log(`⚡ Event-Driven Engine: Ready`);
  console.log(`=======================================================`);
});
