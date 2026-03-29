import Item from "../models/Item.js";

export const addItem = async (req, res) => {
  try {
    const { title, description, location, type } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const payload = {
      title,
      description,
      location,
      type: type || "lost",
      date: req.body.date || new Date(),
    };
    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`;
    }

    const item = await Item.create(payload);
    res.json(item);
  } catch (error) {
    console.error("Add item error", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: "Server error while creating item." });
  }
};

export const getItems = async (req, res) => {
  const filter = {};
  if (req.query.uncollected === "true") {
    filter.collected = false;
  }
  const items = await Item.find(filter);
  res.json(items);
};

export const markCollected = async (req, res) => {
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { collected: true },
    { new: true }
  );
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  res.json(item);
};