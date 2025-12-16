const express = require("express");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const router = express.Router();

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR"
  });
  res.json({ order });
});

router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products, amount, userId } = req.body;
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expected === razorpay_signature) {
    await Order.create({
      userId,
      products,
      amount,
      paymentId: razorpay_payment_id,
      status: "Processing"
    });
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

module.exports = router;