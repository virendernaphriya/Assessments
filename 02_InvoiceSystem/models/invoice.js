const mongoose = require("mongoose");

const itmeSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
});

const invoiceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "Customer",
  },
  items: [itmeSchema],
  discount: {
    type: String,
    default: 0,
  },
  tax: {
    type: String,
    default: 0,
  },
});

const Invoice = mongoose.model("invoice", invoiceSchema);

module.exports = Invoice;
