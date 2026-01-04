const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const categoryController = require("../controllers/category.controller");

router.post("/", authMiddleware(["SuperAdmin", "Admin"]), categoryController.createCategory);
router.get("/", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), categoryController.getCategories);
router.get("/:id", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), categoryController.getCategory);
router.put("/:id", authMiddleware(["SuperAdmin", "Admin"]), categoryController.updateCategory);
router.delete("/:id", authMiddleware(["SuperAdmin", "Admin"]), categoryController.deleteCategory);

module.exports = router;

