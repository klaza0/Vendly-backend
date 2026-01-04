const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  minStock: {
    type: Number,
    default: 10
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", ProductSchema);
