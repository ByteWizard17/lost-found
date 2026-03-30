import User from "../models/User.js";
import Item from "../models/Item.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's posted items
    const postedItems = await Item.find({ userId }).select(
      "title category type image dateLost dateFound status"
    );

    // Get user's claims
    const claims = await Item.find({
      "claims.userId": userId,
    }).select("title type claims");

    res.json({
      user,
      postedItems,
      claims,
      itemsCount: postedItems.length,
      claimsCount: claims.length,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, city, bio, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, city, bio, profileImage },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const getMyItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = await Item.find({ userId }).populate("claims.userId");

    res.json(items);
  } catch (error) {
    console.error("Get my items error:", error);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

export const getMyClaimsOnItems = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all items where this user has made a claim
    const items = await Item.find({
      "claims.userId": userId,
    }).populate("userId", "name email phone");

    // Extract only the claims by this user
    const myClaims = items.map((item) => ({
      itemId: item._id,
      itemTitle: item.title,
      itemType: item.type,
      itemOwner: item.userId,
      claim: item.claims.find((c) => c.userId.toString() === userId.toString()),
    }));

    res.json(myClaims);
  } catch (error) {
    console.error("Get my claims error:", error);
    res.status(500).json({ message: "Failed to fetch claims" });
  }
};

export const getReceivedClaims = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all items posted by this user that have claims
    const items = await Item.find({
      userId,
      claims: { $exists: true, $ne: [] },
    }).populate("claims.userId", "name email phone");

    res.json(items);
  } catch (error) {
    console.error("Get received claims error:", error);
    res.status(500).json({ message: "Failed to fetch claims" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
