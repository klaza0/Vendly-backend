const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

router.post("/", authMiddleware(["SuperAdmin", "Admin"]), userController.createUser);
router.get("/", authMiddleware(["SuperAdmin", "Admin"]), userController.getUsers);
router.get("/:id", authMiddleware(["SuperAdmin", "Admin"]), userController.getUser);
router.put("/:id", authMiddleware(["SuperAdmin", "Admin"]), userController.updateUser);
router.delete("/:id", authMiddleware(["SuperAdmin"]), userController.deleteUser);
router.put("/change-password", authMiddleware(["SuperAdmin", "Admin", "Cashier"]), userController.changePassword);

module.exports = router;
