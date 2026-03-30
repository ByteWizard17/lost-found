import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

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

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err);
  res.status(err.status || 500).json({ 
    message: err.message || "Something went wrong" 
  });
});

// ✅ FIXED PORT (Render friendly)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});