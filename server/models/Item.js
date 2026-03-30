import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: String,
  category: String,
  color: String,
  image: String,
  type: {
    type: String,
    enum: ["lost", "found"],
    default: "lost",
  },
  dateLost: Date,
  dateFound: Date,
  reward: String,
  condition: String,
  phone: String,
  email: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  collected: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  claims: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      claimDate: {
        type: Date,
        default: Date.now,
      },
      message: String,
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  ],
  reports: [
    {
      reportedBy: mongoose.Schema.Types.ObjectId,
      reason: String,
      reportDate: Date,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;

const Item = mongoose.model("Item", itemSchema);

export default Item;