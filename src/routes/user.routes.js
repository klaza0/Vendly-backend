const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

router.post("/", authMiddleware(["SuperAdmin","Admin"]), userController.createUser);

module.exports = router;
