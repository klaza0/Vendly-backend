const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const paymentController = require("../controllers/payment.controller");

router.post("/", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), paymentController.createPayment);
router.get("/", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), paymentController.getPayments);
router.get("/:id", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), paymentController.getPayment);
router.delete("/:id", authMiddleware(["SuperAdmin", "Admin"]), paymentController.deletePayment);

module.exports = router;

