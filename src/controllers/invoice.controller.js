const Invoice = require("../models/Invoice");
const Sale = require("../models/sales");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

const generateInvoiceNumber = async (userId) => {
  const count = await Invoice.countDocuments({ user: userId });
  return `INV-${Date.now()}-${count + 1}`;
};

exports.createInvoice = async (req, res) => {
  try {
    const { customerId, items, discount = 0, paymentMethod = "Cash" } = req.body;

    if (customerId) {
      const customer = await Customer.findOne({
        _id: customerId,
        user: req.user.id
      });
      if (!customer) return res.status(404).json({ msg: "Customer not found" });
    }

    let subtotal = 0;
    const invoiceItems = [];

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        user: req.user.id
      });
      if (!product) return res.status(404).json({ msg: `Product ${item.productId} not found` });

      if (product.stock < item.quantity) {
        return res.status(400).json({ msg: `Not enough stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      invoiceItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const total = subtotal - discount;
    const invoiceNumber = await generateInvoiceNumber(req.user.id);

    const invoice = new Invoice({
      user: req.user.id,
      invoiceNumber,
      customer: customerId || null,
      items: invoiceItems,
      subtotal,
      discount,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash" ? "Paid" : "Pending"
    });

    await invoice.save();

    for (const item of invoiceItems) {
      const sale = new Sale({
        user: req.user.id,
        customer: customerId || null,
        product: item.product,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.total,
        paymentMethod,
        paymentStatus: invoice.paymentStatus,
        invoice: invoice._id
      });
      await sale.save();
    }

    if (customerId) {
      const customer = await Customer.findById(customerId);
      customer.totalPurchases += total;
      await customer.save();
    }

    res.json(await Invoice.findById(invoice._id).populate("customer", "name"));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const { startDate, endDate, customerId } = req.query;
    const query = { user: req.user.id };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (customerId) query.customer = customerId;

    const invoices = await Invoice.find(query)
      .populate("customer", "name email phone")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.id
    })
      .populate("customer", "name email phone address")
      .populate("items.product", "name price");

    if (!invoice) return res.status(404).json({ msg: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { paymentStatus, paymentMethod },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ msg: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!invoice) return res.status(404).json({ msg: "Invoice not found" });

    for (const item of invoice.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    await Sale.deleteMany({ invoice: invoice._id });
    await Invoice.findByIdAndDelete(invoice._id);

    res.json({ msg: "Invoice deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

