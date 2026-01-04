const Supplier = require("../models/Supplier");
const Purchase = require("../models/Purchase");

exports.createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const supplier = new Supplier({
      user: req.user.id,
      name,
      email,
      phone,
      address
    });
    await supplier.save();
    res.json(supplier);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!supplier) return res.status(404).json({ msg: "Supplier not found" });

    const purchases = await Purchase.find({
      supplier: supplier._id,
      user: req.user.id
    }).populate("product", "name");

    const totalPurchases = purchases.reduce((sum, p) => sum + p.totalPrice, 0);

    supplier.totalPurchases = totalPurchases;
    await supplier.save();

    res.json({ supplier, purchases, totalPurchases });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, email, phone, address },
      { new: true }
    );
    if (!supplier) return res.status(404).json({ msg: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!supplier) return res.status(404).json({ msg: "Supplier not found" });
    res.json({ msg: "Supplier deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

