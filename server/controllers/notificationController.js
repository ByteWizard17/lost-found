import Notification from "../models/Notification.js";
import { sendEmail, notificationEmails } from "../services/emailService.js";
import { io } from "../server.js";

export const createNotification = async (userId, type, title, message, itemId = null) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      itemId,
    });

    // Send real-time notification via Socket.io
    io.to(`user_${userId}`).emit("notification", notification);

    return notification;
  } catch (error) {
    console.error("Notification error:", error);
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId })
      .populate("itemId")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    res.json(notification);
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const count = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error("Unread count error:", error);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};
