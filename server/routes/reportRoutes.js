import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  createReport,
  getReports,
  resolveReport,
  getReportStats,
} from "../controllers/reportController.js";

const router = express.Router();

// User routes
router.post("/", authMiddleware, createReport);

// Admin routes
router.get("/", adminMiddleware, getReports);
router.patch("/:reportId/resolve", adminMiddleware, resolveReport);
router.get("/stats", adminMiddleware, getReportStats);

export default router;
