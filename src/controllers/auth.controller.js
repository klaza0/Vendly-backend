const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        message: "Validation error",
        error: "Username and password are required"
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ 
        message: "Server configuration error",
        error: "JWT_SECRET is missing"
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ 
        message: "Authentication failed",
        error: "User not found"
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ 
        message: "Authentication failed",
        error: "Wrong password"
      });
    }

    const token = jwt.sign({
      id: user._id,
      role: user.role,
      subscription_status: user.subscription_status
    }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ 
      token, 
      role: user.role, 
      subscription_status: user.subscription_status,
      userId: user._id,
      username: user.username
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ 
      message: "Server error",
      error: err.message
    });
  }
};
