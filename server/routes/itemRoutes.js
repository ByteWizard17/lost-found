import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addItem,
  getItems,
  markCollected,
  claimItem,
  approveClaim,
  rejectClaim,
  searchItems,
  getPendingItems,
  approveItem,
  rejectItem,
  reportItem,
  getAdminStats,
} from "../controllers/itemController.js";

const router = express.Router();

// Public routes
router.get("/", getItems);
router.get("/search", searchItems);

// Protected routes
router.post("/", authMiddleware, upload.single("image"), addItem);
router.patch("/:id/collected", authMiddleware, markCollected);
router.post("/:itemId/claim", authMiddleware, claimItem);
router.patch("/:itemId/claim/:claimIndex/approve", authMiddleware, approveClaim);
router.patch("/:itemId/claim/:claimIndex/reject", authMiddleware, rejectClaim);
router.post("/:itemId/report", authMiddleware, reportItem);

// Admin routes
router.get("/admin/pending", authMiddleware, getPendingItems);
router.patch("/admin/:itemId/approve", authMiddleware, approveItem);
router.patch("/admin/:itemId/reject", authMiddleware, rejectItem);
router.get("/admin/stats", authMiddleware, getAdminStats);

export default router;