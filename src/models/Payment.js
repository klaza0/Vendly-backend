const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card", "Transfer", "Other"],
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model("Payment", PaymentSchema);

