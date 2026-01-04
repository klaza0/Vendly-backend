const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const productController = require("../controllers/product.controller");

router.post("/", authMiddleware(["SuperAdmin", "Admin"]), productController.addProduct);
router.get("/", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), productController.getProducts);
router.get("/low-stock", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), productController.getLowStockProducts);
router.get("/:id", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), productController.getProduct);
router.put("/:id", authMiddleware(["SuperAdmin", "Admin"]), productController.updateProduct);
router.delete("/:id", authMiddleware(["SuperAdmin", "Admin"]), productController.deleteProduct);

module.exports = router;
