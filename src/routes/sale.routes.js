const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const saleController = require("../controllers/sale.controller");

router.post("/", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), saleController.createSale);
router.get("/", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), saleController.getSales);
router.get("/:id", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), saleController.getSale);

module.exports = router;
