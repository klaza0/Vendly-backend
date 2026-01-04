const Category = require("../models/Category");
const Product = require("../models/Product");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({
      user: req.user.id,
      name,
      description
    });
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!category) return res.status(404).json({ msg: "Category not found" });

    const products = await Product.find({
      category: category._id,
      user: req.user.id
    });

    res.json({ category, products });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, description },
      { new: true }
    );
    if (!category) return res.status(404).json({ msg: "Category not found" });
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!category) return res.status(404).json({ msg: "Category not found" });
    res.json({ msg: "Category deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

