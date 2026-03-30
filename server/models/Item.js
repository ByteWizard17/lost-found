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
  collected: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;