const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (req,res)=>{
  const { username, password, role } = req.body;

  // Admin يقدر يعمل Cashier فقط
  if(req.user.role === "Admin" && role !== "Cashier"){
      return res.status(403).json({ message: "Admins can only create Cashiers" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, role });
  await newUser.save();
  res.json({ message: "User created successfully" });
};
