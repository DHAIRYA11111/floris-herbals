const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

router.get("/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.put("/order/:id", async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
});

router.get("/my-orders/:userId", async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;