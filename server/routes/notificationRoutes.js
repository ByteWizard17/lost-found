import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

// Protected routes
router.get("/", authMiddleware, getNotifications);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.patch("/:notificationId/read", authMiddleware, markAsRead);

export default router;
