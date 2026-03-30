import Item from "../models/Item.js";

export const addItem = async (req, res) => {
  try {
    const { title, description, location, type, category, color, dateLost, dateFound, reward, condition, phone, email } = req.body;
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
      date: new Date(),
    };
    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`;
    }

    const item = await Item.create(payload);
    
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
  const filter = {};
  if (req.query.uncollected === "true") {
    filter.collected = false;
  }
  const items = await Item.find(filter);
  
  // Convert relative image paths to full URLs
  const itemsWithFullImageUrls = items.map((item) => {
    const itemObj = item.toObject ? item.toObject() : item;
    if (itemObj.image && itemObj.image.startsWith("/uploads")) {
      // Get the base URL from environment or construct it
      const baseURL = process.env.API_URL || "https://lost-found-1-flid.onrender.com";
      itemObj.image = `${baseURL}${itemObj.image}`;
    }
    return itemObj;
  });
  
  res.json(itemsWithFullImageUrls);
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