import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateProfile,
  getMyItems,
  getMyClaimsOnItems,
  getReceivedClaims,
  getAllUsers,
} from "../controllers/userController.js";

const router = express.Router();

// Public routes
router.get("/:id", getUserProfile);
router.get("/", getAllUsers);

// Protected routes
router.get("/profile/me", authMiddleware, getUserProfile);
router.put("/profile/update", authMiddleware, updateProfile);
router.get("/items/my-items", authMiddleware, getMyItems);
router.get("/claims/my-claims", authMiddleware, getMyClaimsOnItems);
router.get("/claims/received", authMiddleware, getReceivedClaims);

export default router;
