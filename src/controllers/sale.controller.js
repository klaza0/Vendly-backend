const Sale = require("../models/sales");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

exports.createSale = async (req, res) => {
  const { productId, customerId, quantity, discount = 0, paymentMethod = "Cash", paymentStatus = "Paid" } = req.body;
  try {
    const product = await Product.findOne({ 
      _id: productId, 
      user: req.user.id 
    });
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (product.stock < quantity)
      return res.status(400).json({ msg: "Not enough stock" });

    if (customerId) {
      const customer = await Customer.findOne({
        _id: customerId,
        user: req.user.id
      });
      if (!customer) return res.status(404).json({ msg: "Customer not found" });
    }

    const unitPrice = product.price;
    const subtotal = unitPrice * quantity;
    const totalPrice = subtotal - discount;

    const sale = new Sale({
      user: req.user.id,
      customer: customerId || null,
      product: productId,
      quantity,
      unitPrice,
      discount,
      totalPrice,
      paymentMethod,
      paymentStatus
    });

    await sale.save();

    product.stock -= quantity;
    await product.save();

    if (customerId) {
      const customer = await Customer.findById(customerId);
      customer.totalPurchases += totalPrice;
      await customer.save();
    }

    res.json(await Sale.findById(sale._id)
      .populate("product", "name price")
      .populate("customer", "name"));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getSales = async (req, res) => {
  try {
    const { customerId, productId, startDate, endDate, paymentStatus } = req.query;
    const query = { user: req.user.id };

    if (customerId) query.customer = customerId;
    if (productId) query.product = productId;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (startDate || endDate) {
      query.soldAt = {};
      if (startDate) query.soldAt.$gte = new Date(startDate);
      if (endDate) query.soldAt.$lte = new Date(endDate);
    }

    const sales = await Sale.find(query)
      .populate("product", "name price")
      .populate("customer", "name email")
      .sort({ soldAt: -1 });
    res.json(sales);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      _id: req.params.id,
      user: req.user.id
    })
      .populate("product", "name price")
      .populate("customer", "name email phone");
    if (!sale) return res.status(404).json({ msg: "Sale not found" });
    res.json(sale);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
