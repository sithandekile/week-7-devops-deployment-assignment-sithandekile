// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// DB connection
const connectDB = require('./config/db');
connectDB();

// Import routes
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const roomRoutes = require('./routes/roomRoutes');

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173', // Dev
  'https://my-socket-io-lve-chat.vercel.app' // Prod
];

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      console.log(`🔌 Socket.IO Origin: ${origin}`);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`❌ Socket.IO Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS (Socket.IO)"));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Import and initialize socket events
const socketHandler = require('./socket');
socketHandler(io); // Mounting all socket logic

// Global CORS middleware for REST APIs
app.use(cors({
  origin: (origin, callback) => {
    console.log(`API Origin: ${origin}`);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`API Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS (REST API)"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);

// Root route
app.get('/', (req, res) => {
  res.send(' Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

module.exports = { app, server, io };
