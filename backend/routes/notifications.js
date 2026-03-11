const express = require("express");
const router  = express.Router();
const Notification = require("../models/Notification");

// POST /api/notifications/add — Create a notification
router.post("/add", async (req, res) => {
  try {
    const { userEmail, type, message, nftName, nftImage, price, tokenId } = req.body;
    if (!userEmail || !type || !message)
      return res.status(400).json({ error: "userEmail, type and message required" });
    const notif = await Notification.create({ userEmail: userEmail.toLowerCase(), type, message, nftName, nftImage, price, tokenId });
    res.status(201).json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/notifications/:email — Get all notifications for a user
router.get("/:email", async (req, res) => {
  try {
    const notifs = await Notification.find({ userEmail: req.params.email.toLowerCase() }).sort({ createdAt: -1 }).limit(50);
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/notifications/read/:email — Mark all as read
router.patch("/read/:email", async (req, res) => {
  try {
    await Notification.updateMany({ userEmail: req.params.email.toLowerCase(), read: false }, { $set: { read: true } });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notifications/clear/:email — Clear all notifications
router.delete("/clear/:email", async (req, res) => {
  try {
    await Notification.deleteMany({ userEmail: req.params.email.toLowerCase() });
    res.json({ message: "Notifications cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;