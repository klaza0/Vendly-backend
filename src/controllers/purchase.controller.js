const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

exports.createPurchase = async (req, res) => {
  try {
    const { supplierId, productId, quantity, unitPrice, notes } = req.body;

    const supplier = await Supplier.findOne({
      _id: supplierId,
      user: req.user.id
    });
    if (!supplier) return res.status(404).json({ msg: "Supplier not found" });

    let product = await Product.findOne({
      _id: productId,
      user: req.user.id
    });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const totalPrice = unitPrice * quantity;

    const purchase = new Purchase({
      user: req.user.id,
      supplier: supplierId,
      product: productId,
      quantity,
      unitPrice,
      totalPrice,
      notes
    });
    await purchase.save();

    product.stock += quantity;
    await product.save();

    supplier.totalPurchases += totalPrice;
    await supplier.save();

    res.json(purchase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getPurchases = async (req, res) => {
  try {
    const { supplierId, productId, startDate, endDate } = req.query;
    const query = { user: req.user.id };

    if (supplierId) query.supplier = supplierId;
    if (productId) query.product = productId;
    if (startDate || endDate) {
      query.purchaseDate = {};
      if (startDate) query.purchaseDate.$gte = new Date(startDate);
      if (endDate) query.purchaseDate.$lte = new Date(endDate);
    }

    const purchases = await Purchase.find(query)
      .populate("supplier", "name")
      .populate("product", "name")
      .sort({ purchaseDate: -1 });

    res.json(purchases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      _id: req.params.id,
      user: req.user.id
    })
      .populate("supplier", "name email phone")
      .populate("product", "name price");

    if (!purchase) return res.status(404).json({ msg: "Purchase not found" });
    res.json(purchase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    const { quantity, unitPrice, notes } = req.body;
    const purchase = await Purchase.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!purchase) return res.status(404).json({ msg: "Purchase not found" });

    if (quantity !== undefined && quantity !== purchase.quantity) {
      const product = await Product.findById(purchase.product);
      if (product) {
        const stockDiff = quantity - purchase.quantity;
        product.stock += stockDiff;
        await product.save();
      }
    }

    const totalPrice = (unitPrice || purchase.unitPrice) * (quantity || purchase.quantity);

    Object.assign(purchase, {
      quantity: quantity || purchase.quantity,
      unitPrice: unitPrice || purchase.unitPrice,
      totalPrice,
      notes: notes || purchase.notes
    });

    await purchase.save();
    res.json(purchase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!purchase) return res.status(404).json({ msg: "Purchase not found" });

    const product = await Product.findById(purchase.product);
    if (product && product.stock >= purchase.quantity) {
      product.stock -= purchase.quantity;
      await product.save();
    }

    const supplier = await Supplier.findById(purchase.supplier);
    if (supplier) {
      supplier.totalPurchases -= purchase.totalPrice;
      await supplier.save();
    }

    await Purchase.findByIdAndDelete(purchase._id);
    res.json({ msg: "Purchase deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

