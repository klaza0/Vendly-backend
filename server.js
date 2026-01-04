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

app.use("/login", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/sales", saleRoutes);

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
