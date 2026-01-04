const { authMiddleware } = require("../middleware/auth.middleware");
const saleController = require("../controllers/sale.controller");
const router = require("express").Router();

router.post("/", authMiddleware(["SuperAdmin","Admin","Cashier"]), saleController.createSale);

router.get("/", authMiddleware(["SuperAdmin","Admin","Cashier"]), saleController.getSales);

module.exports = router;
