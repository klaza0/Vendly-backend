const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");

exports.createPayment = async (req, res) => {
  try {
    const { invoiceId, amount, paymentMethod, notes } = req.body;

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      user: req.user.id
    });
    if (!invoice) return res.status(404).json({ msg: "Invoice not found" });

    const existingPayments = await Payment.find({ invoice: invoiceId });
    const paidAmount = existingPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = invoice.total - paidAmount;

    if (amount > remaining) {
      return res.status(400).json({ msg: `Amount exceeds remaining balance. Remaining: ${remaining}` });
    }

    const payment = new Payment({
      user: req.user.id,
      invoice: invoiceId,
      amount,
      paymentMethod,
      notes
    });
    await payment.save();

    const newPaidAmount = paidAmount + amount;
    let paymentStatus = "Partial";
    if (newPaidAmount >= invoice.total) {
      paymentStatus = "Paid";
    } else if (newPaidAmount === 0) {
      paymentStatus = "Pending";
    }

    invoice.paymentStatus = paymentStatus;
    await invoice.save();

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { invoiceId, startDate, endDate } = req.query;
    const query = { user: req.user.id };

    if (invoiceId) query.invoice = invoiceId;
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate("invoice", "invoiceNumber total")
      .sort({ paymentDate: -1 });

    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate("invoice");

    if (!payment) return res.status(404).json({ msg: "Payment not found" });
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!payment) return res.status(404).json({ msg: "Payment not found" });

    const invoice = await Invoice.findById(payment.invoice);
    if (invoice) {
      const remainingPayments = await Payment.find({
        invoice: invoice._id,
        _id: { $ne: payment._id }
      });
      const paidAmount = remainingPayments.reduce((sum, p) => sum + p.amount, 0);

      if (paidAmount === 0) {
        invoice.paymentStatus = "Pending";
      } else if (paidAmount < invoice.total) {
        invoice.paymentStatus = "Partial";
      } else {
        invoice.paymentStatus = "Paid";
      }
      await invoice.save();
    }

    await Payment.findByIdAndDelete(payment._id);
    res.json({ msg: "Payment deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

