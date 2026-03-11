const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");

// ─── GET PROFILE ──────────────────────────────────────────────
// GET /api/profile/:email
router.get("/:email", async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.email.toLowerCase() });
    if (!profile)
      return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── SAVE / UPDATE PROFILE ────────────────────────────────────
// POST /api/profile/save
router.post("/save", async (req, res) => {
  try {
    const { email, avatar, banner, username, bio, twitter, instagram, discord, wallet } = req.body;

    if (!email)
      return res.status(400).json({ error: "Email is required" });

    const updateFields = {};
    if (avatar    !== undefined) updateFields.avatar    = avatar;
    if (banner    !== undefined) updateFields.banner    = banner;
    if (username  !== undefined) updateFields.username  = username;
    if (bio       !== undefined) updateFields.bio       = bio;
    if (twitter   !== undefined) updateFields.twitter   = twitter;
    if (instagram !== undefined) updateFields.instagram = instagram;
    if (discord   !== undefined) updateFields.discord   = discord;
    if (wallet    !== undefined) updateFields.wallet    = wallet;

    const profile = await Profile.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: updateFields },
      { new: true, upsert: true }   // create if doesn't exist
    );

    res.json({ message: "Profile saved successfully", profile });
  } catch (err) {
    console.error("Save profile error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;