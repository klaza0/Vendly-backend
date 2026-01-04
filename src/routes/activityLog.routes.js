const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const activityLogController = require("../controllers/activityLog.controller");

router.get("/", authMiddleware(["SuperAdmin", "Admin"]), activityLogController.getActivityLogs);
router.get("/:id", authMiddleware(["SuperAdmin", "Admin"]), activityLogController.getActivityLog);

module.exports = router;

