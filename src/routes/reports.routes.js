const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const reportsController = require("../controllers/reports.controller");

router.get("/dashboard", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), reportsController.getDashboard);
router.get("/sales", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), reportsController.getSalesReport);
router.get("/products", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), reportsController.getProductsReport);
router.get("/customers", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), reportsController.getCustomersReport);
router.get("/financial", authMiddleware(["SuperAdmin", "Admin"]), reportsController.getFinancialReport);

module.exports = router;

