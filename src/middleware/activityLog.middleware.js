const ActivityLog = require("../models/ActivityLog");

exports.logActivity = (action, entity) => {
  return async (req, res, next) => {
    try {
      if (req.user && req.user.id) {
        const description = `${action} ${entity}`;
        const log = new ActivityLog({
          user: req.user.id,
          action,
          entity,
          description,
          entityId: req.params.id || req.body.id || null,
          changes: req.body
        });
        await log.save();
      }
    } catch (err) {
      console.error("Activity log error:", err.message);
    }
    next();
  };
};

exports.logActivityAfter = (action, entity) => {
  return async (req, res, next) => {
    const originalSend = res.json;
    res.json = function (data) {
      try {
        if (req.user && req.user.id && res.statusCode < 400) {
          const description = `${action} ${entity}`;
          const log = new ActivityLog({
            user: req.user.id,
            action,
            entity,
            description,
            entityId: req.params.id || data._id || data.id || null,
            changes: req.body
          });
          log.save().catch(err => console.error("Activity log error:", err.message));
        }
      } catch (err) {
        console.error("Activity log error:", err.message);
      }
      return originalSend.call(this, data);
    };
    next();
  };
};

