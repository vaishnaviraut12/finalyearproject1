const express = require("express");
const router = express.Router();
const PriceHistory = require("../models/PriceHistory");

// POST /api/history/add
router.post("/add", async (req, res) => {
  try {
    const { tokenId, nftName, nftImage, event, price, from, to, fromEmail, toEmail } = req.body;
    if (!tokenId || !event || !price)
      return res.status(400).json({ error: "tokenId, event and price are required" });
    const record = await PriceHistory.create({ tokenId: String(tokenId), nftName, nftImage, event, price, from, to, fromEmail, toEmail });
    res.status(201).json({ message: "History recorded", record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/history/:tokenId
router.get("/:tokenId", async (req, res) => {
  try {
    const history = await PriceHistory.find({ tokenId: req.params.tokenId }).sort({ createdAt: 1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/history/user/:email
router.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const history = await PriceHistory.find({ $or: [{ fromEmail: email }, { toEmail: email }] }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;