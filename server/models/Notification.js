import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "item_match",
      "claim_received",
      "claim_accepted",
      "claim_rejected",
      "item_approved",
      "item_rejected",
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: String,
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Claim",
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
