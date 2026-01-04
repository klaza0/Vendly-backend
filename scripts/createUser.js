require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");
const bcrypt = require("bcryptjs");

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const args = process.argv.slice(2);
    const username = args[0];
    const password = args[1];
    const role = args[2] || "SuperAdmin";

    if (!username || !password) {
      console.log("Usage: node scripts/createUser.js <username> <password> [role]");
      console.log("Roles: SuperAdmin, Admin, Cashier");
      process.exit(1);
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`User "${username}" already exists!`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      role,
      subscription_status: "Active"
    });

    await user.save();
    console.log(`User "${username}" created successfully with role "${role}"`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating user:", error.message);
    process.exit(1);
  }
};

createUser();

