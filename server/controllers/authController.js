import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Registration attempt:", { name, email });

    if (!name || !email || !password) {
      console.log("Validation error: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not found");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed: " + err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email);

    if (!email || !password) {
      console.log("Validation error: Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      console.log("Blocked user login attempt:", email);
      return res.status(403).json({
        message: user.blockedReason || "Your account has been blocked by admin",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log("Invalid password for user:", email);
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not found");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed: " + err.message });
  }
};
