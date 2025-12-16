const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  userId: String,
  products: Array,
  amount: Number,
  paymentId: String,
  status: { type: String, default: "Processing" },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Order", orderSchema);