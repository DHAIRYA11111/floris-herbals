const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// DEV ONLY: seed sample products
router.get("/seed", async (req, res) => {
  await Product.deleteMany();

  const products = await Product.insertMany([
    {
      name: "Lavender Essential Oil",
      price: 699,
      size: "30ml",
      category: "Essential Oil",
      description: "Pure organic lavender oil for calm and better sleep",
      stock: 50
    },
    {
      name: "Eucalyptus Essential Oil",
      price: 599,
      size: "30ml",
      category: "Essential Oil",
      description: "Refreshing eucalyptus oil for breathing and relaxation",
      stock: 40
    },
    {
      name: "Rose Aroma Oil",
      price: 799,
      size: "20ml",
      category: "Aroma Oil",
      description: "Premium rose aroma oil for candles and diffusers",
      stock: 30
    }
  ]);

  res.json(products);
});

// get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;

