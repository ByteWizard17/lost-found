import Item from "../models/Item.js";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";
import { sendEmail, notificationEmails } from "../services/emailService.js";

export const addItem = async (req, res) => {
  try {
    const { title, description, location, type, category, color, dateLost, dateFound, reward, condition, phone, email } = req.body;
    const userId = req.user._id;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const payload = {
      title,
      description,
      location,
      category,
      color,
      type: type || "lost",
      dateLost,
      dateFound,
      reward,
      condition,
      phone,
      email,
      userId,
      status: "pending", // Items need admin approval
      date: new Date(),
    };
    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`;
    }

    const item = await Item.create(payload);
    
    // Notify admins about new item
    const admins = await User.find({ role: "admin" });
    admins.forEach((admin) => {
      createNotification(
        admin._id,
        "item_pending_approval",
        "New Item Needs Approval",
        `New ${type} item: ${title}`,
        item._id
      );
    });

    // Convert relative image path to full URL in response
    const itemObj = item.toObject ? item.toObject() : item;
    if (itemObj.image && itemObj.image.startsWith("/uploads")) {
      const baseURL = process.env.API_URL || "https://lost-found-1-flid.onrender.com";
      itemObj.image = `${baseURL}${itemObj.image}`;
    }
    
    res.json(itemObj);
  } catch (error) {
    console.error("Add item error", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: "Server error while creating item." });
  }
};

export const getItems = async (req, res) => {
  try {
    const filter = { status: "approved" }; // Only show approved items
    if (req.query.uncollected === "true") {
      filter.collected = false;
    }
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const items = await Item.find(filter).populate("userId", "name phone email");
    
    // Convert relative image paths to full URLs
    const itemsWithFullImageUrls = items.map((item) => {
      const itemObj = item.toObject ? item.toObject() : item;
      if (itemObj.image && itemObj.image.startsWith("/uploads")) {
        const baseURL = process.env.API_URL || "https://lost-found-1-flid.onrender.com";
        itemObj.image = `${baseURL}${itemObj.image}`;
      }
      return itemObj;
    });
    
    res.json(itemsWithFullImageUrls);
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

export const markCollected = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { collected: true },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Mark collected error:", error);
    res.status(500).json({ message: "Failed to mark item as collected" });
  }
};

// CLAIM FUNCTIONS
export const claimItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if user already claimed this item
    const existingClaim = item.claims.find((c) => c.userId.toString() === userId.toString());
    if (existingClaim) {
      return res.status(400).json({ message: "You have already claimed this item" });
    }

    // Add claim
    item.claims.push({ userId, message });
    await item.save();

    // Notify item owner
    const owner = await User.findById(item.userId);
    createNotification(
      item.userId,
      "claim_received",
      "New Claim on Your Item",
      `${req.user.name} claimed your item: ${item.title}`,
      itemId
    );

    if (owner && owner.email) {
      const emailData = notificationEmails.claimReceived(item.title, req.user.name);
      sendEmail(owner.email, emailData.subject, emailData.html);
    }

    res.json({ message: "Claim submitted successfully", item });
  } catch (error) {
    console.error("Claim item error:", error);
    res.status(500).json({ message: "Failed to claim item" });
  }
};

export const approveClaim = async (req, res) => {
  try {
    const { itemId, claimIndex } = req.params;
    const userId = req.user._id;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Verify user is the item owner
    if (item.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Approve the claim
    item.claims[claimIndex].status = "accepted";
    await item.save();

    // Notify claimer
    const claimer = item.claims[claimIndex].userId;
    createNotification(claimer, "claim_accepted", "Claim Accepted", `Your claim for ${item.title} has been accepted!`, itemId);

    const claimerUser = await User.findById(claimer);
    if (claimerUser && claimerUser.email) {
      const emailData = notificationEmails.claimAccepted(item.title);
      sendEmail(claimerUser.email, emailData.subject, emailData.html);
    }

    res.json({ message: "Claim accepted", item });
  } catch (error) {
    console.error("Approve claim error:", error);
    res.status(500).json({ message: "Failed to approve claim" });
  }
};

export const rejectClaim = async (req, res) => {
  try {
    const { itemId, claimIndex } = req.params;
    const userId = req.user._id;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    item.claims[claimIndex].status = "rejected";
    await item.save();

    const claimer = item.claims[claimIndex].userId;
    createNotification(claimer, "claim_rejected", "Claim Rejected", `Your claim for ${item.title} was not accepted.`, itemId);

    res.json({ message: "Claim rejected", item });
  } catch (error) {
    console.error("Reject claim error:", error);
    res.status(500).json({ message: "Failed to reject claim" });
  }
};

// SEARCH AND FILTER
export const searchItems = async (req, res) => {
  try {
    const { keyword, category, dateFrom, dateTo, type } = req.query;
    const filter = { status: "approved", collected: false };

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ];
    }
    if (category) {
      filter.category = category;
    }
    if (type) {
      filter.type = type;
    }
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const items = await Item.find(filter).populate("userId", "name phone");

    const itemsWithImages = items.map((item) => {
      const itemObj = item.toObject ? item.toObject() : item;
      if (itemObj.image && itemObj.image.startsWith("/uploads")) {
        const baseURL = process.env.API_URL || "https://lost-found-1-flid.onrender.com";
        itemObj.image = `${baseURL}${itemObj.image}`;
      }
      return itemObj;
    });

    res.json(itemsWithImages);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Failed to search items" });
  }
};

// ADMIN FUNCTIONS
export const getPendingItems = async (req, res) => {
  try {
    const items = await Item.find({ status: "pending" }).populate("userId", "name email");
    res.json(items);
  } catch (error) {
    console.error("Get pending error:", error);
    res.status(500).json({ message: "Failed to fetch pending items" });
  }
};

export const approveItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findByIdAndUpdate(
      itemId,
      { status: "approved" },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Notify owner
    createNotification(
      item.userId,
      "item_approved",
      "Item Approved",
      `Your item "${item.title}" has been approved and is now visible to everyone!`,
      itemId
    );

    const owner = await User.findById(item.userId);
    if (owner && owner.email) {
      const emailData = notificationEmails.itemApproved(item.title);
      sendEmail(owner.email, emailData.subject, emailData.html);
    }

    res.json({ message: "Item approved", item });
  } catch (error) {
    console.error("Approve item error:", error);
    res.status(500).json({ message: "Failed to approve item" });
  }
};

export const rejectItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { reason } = req.body;

    const item = await Item.findByIdAndUpdate(
      itemId,
      { status: "rejected" },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    createNotification(
      item.userId,
      "item_rejected",
      "Item Rejected",
      `Your item "${item.title}" was rejected. Reason: ${reason}`,
      itemId
    );

    res.json({ message: "Item rejected", item });
  } catch (error) {
    console.error("Reject item error:", error);
    res.status(500).json({ message: "Failed to reject item" });
  }
};

export const reportItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.reports.push({ reportedBy: userId, reason, reportDate: new Date() });
    await item.save();

    // Notify admins
    const admins = await User.find({ role: "admin" });
    admins.forEach((admin) => {
      createNotification(admin._id, "item_reported", "Item Reported", `Item "${item.title}" has been reported. Reason: ${reason}`, itemId);
    });

    res.json({ message: "Item reported successfully" });
  } catch (error) {
    console.error("Report item error:", error);
    res.status(500).json({ message: "Failed to report item" });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const approvedItems = await Item.countDocuments({ status: "approved" });
    const pendingItems = await Item.countDocuments({ status: "pending" });
    const rejectedItems = await Item.countDocuments({ status: "rejected" });
    const lostItems = await Item.countDocuments({ type: "lost", status: "approved" });
    const foundItems = await Item.countDocuments({ type: "found", status: "approved" });
    const reportedItems = await Item.countDocuments({ reports: { $exists: true, $not: { $size: 0 } } });

    const totalUsers = await User.countDocuments();
    const totalClaims = await Item.aggregate([
      { $group: { _id: null, totalClaims: { $sum: { $size: "$claims" } } } },
    ]);

    res.json({
      items: {
        total: totalItems,
        approved: approvedItems,
        pending: pendingItems,
        rejected: rejectedItems,
        lost: lostItems,
        found: foundItems,
        reported: reportedItems,
      },
      users: totalUsers,
      claims: totalClaims[0]?.totalClaims || 0,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
};