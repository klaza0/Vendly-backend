require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const productRoutes = require("./routes/product.routes");
app.use("/api/products", productRoutes);

const saleRoutes = require("./routes/sale.routes");
app.use("/api/sales", saleRoutes);

app.get("/", (req, res) => res.send("Sales API Running"));

module.exports = app;
