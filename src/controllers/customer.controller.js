const Customer = require("../models/Customer");
const Sale = require("../models/sales");

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const customer = new Customer({
      user: req.user.id,
      name,
      email,
      phone,
      address
    });
    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!customer) return res.status(404).json({ msg: "Customer not found" });

    const sales = await Sale.find({
      customer: customer._id,
      user: req.user.id
    }).populate("product", "name price");

    const totalPurchases = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);

    customer.totalPurchases = totalPurchases;
    await customer.save();

    res.json({ customer, sales, totalPurchases });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, email, phone, address },
      { new: true }
    );
    if (!customer) return res.status(404).json({ msg: "Customer not found" });
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!customer) return res.status(404).json({ msg: "Customer not found" });
    res.json({ msg: "Customer deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

