import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getUserProfile,
  updateProfile,
  getMyItems,
  getMyClaimsOnItems,
  getReceivedClaims,
  getAllUsers,
  getUserDetails,
  blockUser,
  unblockUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// Protected routes
router.get("/profile/me", authMiddleware, getUserProfile);
router.put("/profile/update", authMiddleware, updateProfile);
router.get("/items/my-items", authMiddleware, getMyItems);
router.get("/claims/my-claims", authMiddleware, getMyClaimsOnItems);
router.get("/claims/received", authMiddleware, getReceivedClaims);

// Admin routes
router.get("/admin/all", adminMiddleware, getAllUsers);
router.get("/admin/:userId", adminMiddleware, getUserDetails);
router.post("/admin/:userId/block", adminMiddleware, blockUser);
router.post("/admin/:userId/unblock", adminMiddleware, unblockUser);
router.delete("/admin/:userId", adminMiddleware, deleteUser);

// Public routes
router.get("/:id", getUserProfile);

export default router;
