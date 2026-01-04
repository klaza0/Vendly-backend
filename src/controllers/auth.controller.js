const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req,res)=>{
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if(!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if(!valid) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({
    id: user._id,
    role: user.role,
    subscription_status: user.subscription_status
  }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.json({ token, role: user.role, subscription_status: user.subscription_status });
};
