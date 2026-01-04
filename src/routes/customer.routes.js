const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const customerController = require("../controllers/customer.controller");

router.post("/", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), customerController.createCustomer);
router.get("/", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), customerController.getCustomers);
router.get("/:id", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), customerController.getCustomer);
router.put("/:id", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), customerController.updateCustomer);
router.delete("/:id", authMiddleware(["SuperAdmin", "Admin"]), customerController.deleteCustomer);

module.exports = router;

