import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../db.js";
import User from "../models/User.js";

dotenv.config();

const args = process.argv.slice(2);

const getArgValue = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1 || index === args.length - 1) return "";
  return args[index + 1];
};

const name = getArgValue("--name");
const email = getArgValue("--email");
const password = getArgValue("--password");

if (!name || !email || !password) {
  console.error(
    "Usage: npm run create-admin -- --name \"Admin\" --email admin@example.com --password secret123"
  );
  process.exit(1);
}

const createAdmin = async () => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.role = "admin";
      existingUser.isBlocked = false;
      existingUser.blockedReason = null;
      existingUser.blockedAt = null;
      await existingUser.save();
      console.log(`Updated existing user as admin: ${email}`);
    } else {
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`Created admin user: ${email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

createAdmin();
