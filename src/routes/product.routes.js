const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.post("/", productController.addProduct);

router.get("/", productController.getProducts);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

module.exports = router;
