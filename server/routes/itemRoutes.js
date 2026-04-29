import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
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
  getAllItems,
  deleteItem,
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
router.get("/admin/all", adminMiddleware, getAllItems);
router.get("/admin/pending", adminMiddleware, getPendingItems);
router.patch("/admin/:itemId/approve", adminMiddleware, approveItem);
router.patch("/admin/:itemId/reject", adminMiddleware, rejectItem);
router.delete("/admin/:itemId", adminMiddleware, deleteItem);
router.get("/admin/stats", adminMiddleware, getAdminStats);

export default router;