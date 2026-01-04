const Sale = require("../models/sales");
const Product = require("../models/Product");

exports.createSale = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (product.stock < quantity)
      return res.status(400).json({ msg: "Not enough stock" });

    const totalPrice = product.price * quantity;

    const sale = new Sale({
      product: productId,
      quantity,
      totalPrice
    });

    await sale.save();

    product.stock -= quantity;
    await product.save();

    res.json(sale);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("product", "name price");
    res.json(sales);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
