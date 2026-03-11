const express  = require("express");
const router   = express.Router();
const Profile  = require("../models/Profile");
const NFT      = require("../models/NFT");
const User     = require("../models/User");

// GET /api/public/profile/:wallet  — lookup by wallet address
router.get("/profile/:wallet", async (req, res) => {
  try {
    const wallet  = req.params.wallet.toLowerCase();
    const profile = await Profile.findOne({ wallet });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const nfts    = await NFT.find({ ownerEmail: profile.email });
    const minted  = nfts.filter(n => n.seller?.toLowerCase() === wallet);
    const bought  = nfts.filter(n => n.seller?.toLowerCase() !== wallet);

    const totalVolume = nfts.reduce((sum, n) => sum + parseFloat(n.price || 0), 0);

    res.json({
      profile,
      stats: {
        totalNFTs:    nfts.length,
        minted:       minted.length,
        purchased:    bought.length,
        totalVolume:  totalVolume.toFixed(4),
      },
      nfts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/public/search?q=username  — search by username
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2)
      return res.status(400).json({ error: "Query must be at least 2 characters" });

    const profiles = await Profile.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { wallet:   { $regex: q, $options: "i" } },
      ]
    }).limit(10);

    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/public/all  — list all users (for discovery)
router.get("/all", async (req, res) => {
  try {
    const profiles = await Profile.find({ wallet: { $ne: "" } }).limit(20);
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;