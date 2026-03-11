const express = require("express");
const router = express.Router();
const NFT = require("../models/NFT");

// POST /api/nfts/save — Save NFT after minting
router.post("/save", async (req, res) => {
  try {
    const { ownerEmail, tokenId, name, description, image, category, price, seller, owner, tokenURI } = req.body;
    if (!ownerEmail || !tokenId)
      return res.status(400).json({ error: "ownerEmail and tokenId are required" });
    const nft = await NFT.findOneAndUpdate(
      { ownerEmail: ownerEmail.toLowerCase(), tokenId: String(tokenId) },
      { $set: { name, description, image, category, price, seller, owner, tokenURI, ownerEmail: ownerEmail.toLowerCase() } },
      { new: true, upsert: true }
    );
    res.status(201).json({ message: "NFT saved successfully", nft });
  } catch (err) {
    res.status(500).json({ error: "Server error saving NFT" });
  }
});

// GET /api/nfts/:email — Get all NFTs for a user
router.get("/:email", async (req, res) => {
  try {
    const nfts = await NFT.find({ ownerEmail: req.params.email.toLowerCase() }).sort({ createdAt: -1 });
    res.json(nfts);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching NFTs" });
  }
});

// POST /api/nfts/transfer — Transfer NFT ownership after purchase
router.post("/transfer", async (req, res) => {
  try {
    const { tokenId, newOwnerEmail, newOwner } = req.body;
    if (!tokenId || !newOwnerEmail || !newOwner)
      return res.status(400).json({ error: "tokenId, newOwnerEmail and newOwner are required" });
    const nft = await NFT.findOne({ tokenId: String(tokenId) });
    if (!nft) return res.status(404).json({ error: "NFT not found" });
    nft.ownerEmail = newOwnerEmail.toLowerCase();
    nft.owner = newOwner;
    await nft.save();
    res.json({ message: "NFT transferred successfully", nft });
  } catch (err) {
    res.status(500).json({ error: "Server error transferring NFT" });
  }
});

// DELETE /api/nfts/one/:tokenId — Delete single NFT
router.delete("/one/:tokenId", async (req, res) => {
  try {
    await NFT.findOneAndDelete({ tokenId: req.params.tokenId });
    res.json({ message: "NFT removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/nfts/clear/:email — Delete ALL NFTs for a user
router.delete("/clear/:email", async (req, res) => {
  try {
    const result = await NFT.deleteMany({ ownerEmail: req.params.email.toLowerCase() });
    res.json({ message: `Deleted ${result.deletedCount} NFTs successfully` });
  } catch (err) {
    res.status(500).json({ error: "Server error clearing NFTs" });
  }
});

// GET /api/nfts — Get all marketplace NFTs
router.get("/", async (req, res) => {
  try {
    const nfts = await NFT.find().sort({ createdAt: -1 });
    res.json(nfts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;