const { authMiddleware } = require("../middleware/auth.middleware");
const productController = require("../controllers/product.controller");
const router = require("express").Router();

router.post("/", authMiddleware(["SuperAdmin","Admin"]), productController.addProduct);

router.get("/", authMiddleware(["SuperAdmin","Admin","Cashier"]), productController.getProducts);

router.put("/:id", authMiddleware(["SuperAdmin","Admin"]), productController.updateProduct);

router.delete("/:id", authMiddleware(["SuperAdmin","Admin"]), productController.deleteProduct);

module.exports = router;
