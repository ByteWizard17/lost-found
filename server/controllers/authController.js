import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("📝 Registration attempt:", { name, email });

    // Validation
    if (!name || !email || !password) {
      console.log("❌ Validation error: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    console.log("✅ User registered successfully:", user._id);

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not found!");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ 
      token, 
      user: { _id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Registration failed: " + err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Login attempt:", email);

    // Validation
    if (!email || !password) {
      console.log("❌ Validation error: Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log("❌ Invalid password for user:", email);
      return res.status(400).json({ message: "Invalid password" });
    }

    console.log("✅ Password matched for user:", email);

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not found!");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    console.log("✅ Token generated successfully for:", email);

    res.json({ 
      token, 
      user: { _id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed: " + err.message });
  }
};