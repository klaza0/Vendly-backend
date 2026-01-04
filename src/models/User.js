const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["SuperAdmin","Admin","Cashier"], required: true },
    subscription_status: { type: String, enum: ["Active","Expired"], default: "Active" }
});

module.exports = mongoose.model("User", userSchema);
