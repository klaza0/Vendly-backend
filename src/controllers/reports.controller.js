const Sale = require("../models/sales");
const Product = require("../models/Product");
const Invoice = require("../models/Invoice");
const Purchase = require("../models/Purchase");
const Customer = require("../models/Customer");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySales = await Sale.find({
      user: userId,
      soldAt: { $gte: today, $lt: tomorrow }
    });

    const totalSales = await Sale.find({ user: userId });
    const totalProducts = await Product.countDocuments({ user: userId });
    const totalCustomers = await Customer.countDocuments({ user: userId });

    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalRevenue = totalSales.reduce((sum, sale) => sum + sale.totalPrice, 0);

    const lowStockProducts = await Product.find({
      user: userId,
      $expr: { $lte: ["$stock", "$minStock"] }
    });

    const topProducts = await Sale.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$product", totalQuantity: { $sum: "$quantity" }, totalRevenue: { $sum: "$totalPrice" } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $project: { productName: "$product.name", totalQuantity: 1, totalRevenue: 1 } }
    ]);

    res.json({
      todayRevenue,
      totalRevenue,
      totalProducts,
      totalCustomers,
      todaySalesCount: todaySales.length,
      totalSalesCount: totalSales.length,
      lowStockProducts: lowStockProducts.length,
      lowStockProductsList: lowStockProducts,
      topProducts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query;
    const query = { user: req.user.id };

    if (startDate || endDate) {
      query.soldAt = {};
      if (startDate) query.soldAt.$gte = new Date(startDate);
      if (endDate) query.soldAt.$lte = new Date(endDate);
    }

    const sales = await Sale.find(query)
      .populate("product", "name")
      .populate("customer", "name")
      .sort({ soldAt: -1 });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const averageSale = sales.length > 0 ? totalRevenue / sales.length : 0;

    let groupedData = {};
    sales.forEach(sale => {
      const date = new Date(sale.soldAt);
      let key;
      if (groupBy === "day") {
        key = date.toISOString().split("T")[0];
      } else if (groupBy === "month") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      } else {
        key = date.getFullYear().toString();
      }

      if (!groupedData[key]) {
        groupedData[key] = { revenue: 0, count: 0, quantity: 0 };
      }
      groupedData[key].revenue += sale.totalPrice;
      groupedData[key].count += 1;
      groupedData[key].quantity += sale.quantity;
    });

    res.json({
      totalRevenue,
      totalQuantity,
      totalSales: sales.length,
      averageSale,
      groupedData,
      sales
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getProductsReport = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });

    const salesByProduct = await Sale.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: "$product",
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalPrice" },
          saleCount: { $sum: 1 }
        }
      },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      {
        $project: {
          productId: "$_id",
          productName: "$product.name",
          currentStock: "$product.stock",
          totalSold: 1,
          totalRevenue: 1,
          saleCount: 1
        }
      },
      { $sort: { totalSold: -1 } }
    ]);

    const lowStockProducts = products.filter(p => p.stock <= p.minStock);
    const outOfStockProducts = products.filter(p => p.stock === 0);

    res.json({
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      lowStockProducts,
      outOfStockProducts,
      salesByProduct
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getCustomersReport = async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.user.id });

    const customerStats = await Sale.aggregate([
      { $match: { user: req.user.id, customer: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$customer",
          totalPurchases: { $sum: "$totalPrice" },
          purchaseCount: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" }
        }
      },
      { $sort: { totalPurchases: -1 } },
      { $lookup: { from: "customers", localField: "_id", foreignField: "_id", as: "customer" } },
      { $unwind: "$customer" },
      {
        $project: {
          customerId: "$_id",
          customerName: "$customer.name",
          customerEmail: "$customer.email",
          totalPurchases: 1,
          purchaseCount: 1,
          totalQuantity: 1
        }
      }
    ]);

    res.json({
      totalCustomers: customers.length,
      activeCustomers: customerStats.length,
      customerStats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user.id };

    if (startDate || endDate) {
      query.soldAt = {};
      if (startDate) query.soldAt.$gte = new Date(startDate);
      if (endDate) query.soldAt.$lte = new Date(endDate);
    }

    const sales = await Sale.find(query);
    const purchases = await Purchase.find({
      user: req.user.id,
      purchaseDate: startDate || endDate ? {
        ...(startDate && { $gte: new Date(startDate) }),
        ...(endDate && { $lte: new Date(endDate) })
      } : {}
    });

    const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
    const totalCost = purchases.reduce((sum, p) => sum + p.totalPrice, 0);
    const profit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    res.json({
      totalRevenue,
      totalCost,
      profit,
      profitMargin: profitMargin.toFixed(2),
      salesCount: sales.length,
      purchasesCount: purchases.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

