const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const invoiceController = require("../controllers/invoice.controller");

router.post("/", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), invoiceController.createInvoice);
router.get("/", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), invoiceController.getInvoices);
router.get("/:id", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), invoiceController.getInvoice);
router.put("/:id", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), invoiceController.updateInvoice);
router.delete("/:id", authMiddleware(["SuperAdmin", "Admin"]), invoiceController.deleteInvoice);

module.exports = router;

