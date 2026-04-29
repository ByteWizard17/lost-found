import jwt from "jsonwebtoken";
import User from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const userId = decoded._id || decoded.id;
    const user = await User.findById(userId).select(
      "_id role isBlocked blockedReason"
    );

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: user.blockedReason || "Your account has been blocked by admin",
      });
    }

    if (user.role !== "admin") {
      console.log("Access denied: User is not admin", userId);
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    req.user = {
      ...decoded,
      _id: user._id,
      role: user.role,
    };
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(401).json({ message: "Unauthorized access" });
  }
};

export default adminMiddleware;
