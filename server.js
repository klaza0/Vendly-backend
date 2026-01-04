require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const productRoutes = require("./src/routes/product.routes");
const saleRoutes = require("./src/routes/sale.routes");
const customerRoutes = require("./src/routes/customer.routes");
const categoryRoutes = require("./src/routes/category.routes");
const invoiceRoutes = require("./src/routes/invoice.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const supplierRoutes = require("./src/routes/supplier.routes");
const purchaseRoutes = require("./src/routes/purchase.routes");
const reportsRoutes = require("./src/routes/reports.routes");
const activityLogRoutes = require("./src/routes/activityLog.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/activity-logs", activityLogRoutes);

app.get("/", (req, res) => res.send("Vendly Sales API Running"));

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
