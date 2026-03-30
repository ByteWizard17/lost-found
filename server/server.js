import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import connectDB from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables first
dotenv.config();

// Verify environment variables
if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET is not set in .env file");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not set in .env file");
  process.exit(1);
}

console.log("✅ Environment variables loaded successfully");

// connect database
connectDB();

const app = express();


// ✅ FIXED CORS (allows mobile + all devices)
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err);
  res.status(err.status || 500).json({ 
    message: err.message || "Something went wrong" 
  });
});

// ✅ FIXED PORT (Render friendly)
const PORT = process.env.PORT || 10000;

// Create HTTP server with Socket.io
const server = http.createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // When user joins notification room
  socket.on("user_connected", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined notification room`);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔌 Socket.io enabled for real-time notifications`);
});