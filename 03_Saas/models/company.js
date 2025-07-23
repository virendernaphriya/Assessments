const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tenantId: {
    type: String,
    required: true,
    unique: true,
  },
});

const Company = mongoose.model("company", companySchema);

module.exports = Company;
