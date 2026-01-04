const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: "Username, password, and role are required" });
    }

    if (!["SuperAdmin", "Admin", "Cashier"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be SuperAdmin, Admin, or Cashier" });
    }

    if (req.user.role === "Admin" && role !== "Cashier") {
      return res.status(403).json({ message: "Admins can only create Cashiers" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      subscription_status: "Active"
    });

    await newUser.save();
    res.json({ message: "User created successfully", user: { id: newUser._id, username: newUser.username, role: newUser.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, role, subscription_status } = req.body;
    const updateData = {};

    if (req.user.role !== "SuperAdmin" && req.params.id !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own account" });
    }

    if (req.user.role === "Admin" && role && role !== "Cashier") {
      return res.status(403).json({ message: "Admins can only assign Cashier role" });
    }

    if (username) updateData.username = username;
    if (role && req.user.role === "SuperAdmin") updateData.role = role;
    if (subscription_status && req.user.role === "SuperAdmin") updateData.subscription_status = subscription_status;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Only SuperAdmin can delete users" });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old password and new password are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid old password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
