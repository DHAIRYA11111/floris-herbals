const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  size: String,
  category: String,
  description: String,
  image: String,
  stock: Number
});

module.exports = mongoose.model("Product", productSchema);

