import Report from "../models/Report.js";
import Item from "../models/Item.js";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";
import { sendEmail } from "../services/emailService.js";

// USER: Create a report for an item
export const createReport = async (req, res) => {
  try {
    const { itemId, reason, description } = req.body;
    const reportedBy = req.user._id;

    // Validate input
    if (!itemId || !reason || !description) {
      return res.status(400).json({ message: "Item ID, reason, and description are required" });
    }

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if user already reported this item
    const existingReport = await Report.findOne({
      itemId,
      reportedBy,
      status: "pending",
    });

    if (existingReport) {
      return res.status(400).json({ message: "You have already reported this item" });
    }

    const report = await Report.create({
      itemId,
      reportedBy,
      reason,
      description,
    });

    // Notify admins
    const admins = await User.find({ role: "admin" });
    admins.forEach((admin) => {
      createNotification(
        admin._id,
        "post_reported",
        "New Report Submitted",
        `Item "${item.title}" has been reported. Reason: ${reason}`,
        itemId
      );
    });

    res.json({ message: "Report submitted successfully", report });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ message: "Failed to submit report" });
  }
};

// ADMIN: Get all reports
export const getReports = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .populate("itemId", "title description image")
      .populate("reportedBy", "name email")
      .populate("resolvedBy", "name")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// ADMIN: Resolve a report (delete or dismiss)
export const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action, deleteReason } = req.body;
    const adminId = req.user._id;

    if (!["deleted", "dismissed"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Must be 'deleted' or 'dismissed'" });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "resolved";
    report.resolvedBy = adminId;
    report.resolvedAction = action;
    report.resolvedAt = new Date();
    await report.save();

    // If action is delete, delete the item
    if (action === "deleted") {
      const item = await Item.findByIdAndDelete(report.itemId);

      if (item) {
        // Notify item owner
        createNotification(
          item.userId,
          "item_deleted",
          "Item Deleted",
          `Your item "${item.title}" has been deleted due to community report violations. Reason: ${deleteReason || "Violation of community guidelines"}`,
          item._id
        );

        const owner = await User.findById(item.userId);
        if (owner && owner.email) {
          sendEmail(
            owner.email,
            "Item Deleted - Community Report",
            `<p>Your item "<strong>${item.title}</strong>" has been deleted due to community report.</p><p>Reason: ${deleteReason || "Violation of community guidelines"}</p>`
          );
        }
      }

      res.json({ message: "Report resolved and item deleted", report });
    } else {
      // Dismiss report
      res.json({ message: "Report dismissed", report });
    }
  } catch (error) {
    console.error("Resolve report error:", error);
    res.status(500).json({ message: "Failed to resolve report" });
  }
};

// ADMIN: Get report statistics
export const getReportStats = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });
    const resolvedReports = await Report.countDocuments({ status: "resolved" });

    const reportsByReason = await Report.aggregate([
      {
        $group: {
          _id: "$reason",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      total: totalReports,
      pending: pendingReports,
      resolved: resolvedReports,
      byReason: reportsByReason,
    });
  } catch (error) {
    console.error("Get report stats error:", error);
    res.status(500).json({ message: "Failed to fetch report statistics" });
  }
};
