const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  collectionAffected: {
    type: String,
    required: true,
  },
  operationType: {
    type: String,
    enum: ["PUT", "POST", "DELETE", "PATCH"],
  },
  timestamps: {
    type: Date,
    default: Date.now,
  },
  oldData: {
    type: Object,
    default: null,
  },
  newData: {
    type: Object,
    default: null,
  },
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;
