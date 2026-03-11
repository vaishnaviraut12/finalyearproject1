const mongoose = require("mongoose");

const NFTSchema = new mongoose.Schema(
  {
    ownerEmail:  { type: String, required: true, lowercase: true },
    tokenId:     { type: String, required: true },
    name:        { type: String, default: "" },
    description: { type: String, default: "" },
    image:       { type: String, default: "" },
    category:    { type: String, default: "Gaming" },
    price:       { type: String, default: "0" },
    seller:      { type: String, default: "" },   // wallet address of minter
    owner:       { type: String, default: "" },   // current wallet address owner
    tokenURI:    { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate saves per user+token
NFTSchema.index({ ownerEmail: 1, tokenId: 1 }, { unique: true });

module.exports = mongoose.model("NFT", NFTSchema);