const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/wishlist", async (req, res) => {
  const { userId, wishlist } = req.body;
  await User.findByIdAndUpdate(userId, { wishlist });
  res.json({ success: true });
});

module.exports = router;