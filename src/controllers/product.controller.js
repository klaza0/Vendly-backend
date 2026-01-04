const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  const { name, category, price, stock, minStock, description } = req.body;
  try {
    const product = new Product({ 
      user: req.user.id,
      name,
      category: category || null,
      price, 
      stock: stock || 0,
      minStock: minStock || 10,
      description: description || ""
    });
    await product.save();
    res.json(await Product.findById(product._id).populate("category", "name"));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, search, lowStock } = req.query;
    const query = { user: req.user.id };

    if (category) query.category = category;
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (lowStock === "true") {
      query.$expr = { $lte: ["$stock", "$minStock"] };
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateProduct = async (req, res) => {
  const { name, category, price, stock, minStock, description } = req.body;
  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (minStock !== undefined) updateData.minStock = minStock;
    if (description !== undefined) updateData.description = description;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    );
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(await Product.findById(product._id).populate("category", "name"));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate("category", "name");
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      user: req.user.id,
      $expr: { $lte: ["$stock", "$minStock"] }
    }).populate("category", "name");
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json({ msg: "Product deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
