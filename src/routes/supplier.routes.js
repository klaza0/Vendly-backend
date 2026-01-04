const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const supplierController = require("../controllers/supplier.controller");

router.post("/", authMiddleware(["SuperAdmin", "Admin"]), supplierController.createSupplier);
router.get("/", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), supplierController.getSuppliers);
router.get("/:id", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), supplierController.getSupplier);
router.put("/:id", authMiddleware(["SuperAdmin", "Admin"]), supplierController.updateSupplier);
router.delete("/:id", authMiddleware(["SuperAdmin", "Admin"]), supplierController.deleteSupplier);

module.exports = router;

