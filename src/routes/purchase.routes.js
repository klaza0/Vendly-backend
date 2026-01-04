const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const purchaseController = require("../controllers/purchase.controller");

router.post("/", authMiddleware(["SuperAdmin", "Admin"]), purchaseController.createPurchase);
router.get("/", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), purchaseController.getPurchases);
router.get("/:id", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), purchaseController.getPurchase);
router.put("/:id", authMiddleware(["SuperAdmin", "Admin"]), purchaseController.updatePurchase);
router.delete("/:id", authMiddleware(["SuperAdmin", "Admin"]), purchaseController.deletePurchase);

module.exports = router;

