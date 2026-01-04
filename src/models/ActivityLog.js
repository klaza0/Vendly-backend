const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ["CREATE", "UPDATE", "DELETE", "VIEW", "LOGIN", "LOGOUT"]
  },
  entity: {
    type: String,
    required: true,
    enum: ["Product", "Sale", "Customer", "Category", "Invoice", "Payment", "Supplier", "Purchase", "User"]
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  description: {
    type: String,
    required: true
  },
  changes: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);

