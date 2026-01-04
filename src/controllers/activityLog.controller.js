const ActivityLog = require("../models/ActivityLog");

exports.getActivityLogs = async (req, res) => {
  try {
    const { entity, action, startDate, endDate, limit = 50 } = req.query;
    const query = { user: req.user.id };

    if (entity) query.entity = entity;
    if (action) query.action = action;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!log) return res.status(404).json({ msg: "Activity log not found" });
    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

