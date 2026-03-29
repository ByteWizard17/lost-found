import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { addItem, getItems, markCollected } from "../controllers/itemController.js";

const router = express.Router();

router.post("/", upload.single("image"), addItem);
router.get("/", getItems);
router.patch("/:id/collected", markCollected);

export default router;