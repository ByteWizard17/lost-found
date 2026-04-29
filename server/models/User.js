import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: String,
  city: String,
  profileImage: String,
  bio: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  blockedReason: String,
  blockedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
