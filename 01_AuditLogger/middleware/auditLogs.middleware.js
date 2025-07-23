const AuditLog = require("../models/AuditLog");

const auditLogger = (collectionName, collection) => {
  return async (req, res, next) => {
    const operationType = req.method;
    let newData = null;
    let oldData = null;
    const now = new Date();

    if (operationType == "PUT" || operationType == "PATCH") {
      const id = req.params.id;
      newData = req.body || null;
      oldData = (await collection.findById(id)) || null;
    }

    if (operationType == "POST") {
      newData = req.body || null;
    }

    if (operationType == "DELETE") {
      const { id } = req.params;

      oldData = await collection.find({});

      newData = await collection.find({ _id: { $ne: id } });
    }

    const auditLog = new AuditLog({
      userId: req.user._id,
      timestamps: now.toLocaleString(),
      operationType,
      collectionAffected: collectionName,
      newData,
      oldData,
    });

    console.log("Logging Details", auditLog);
    await auditLog.save();
    next();
  };
};

module.exports = auditLogger;
