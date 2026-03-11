const mongoose = require("mongoose");

const PriceHistorySchema = new mongoose.Schema(
  {
    tokenId:   { type: String, required: true },
    nftName:   { type: String, default: "" },
    nftImage:  { type: String, default: "" },
    event:     { type: String, enum: ["Minted", "Sale", "Unlisted"], required: true },
    price:     { type: String, required: true },
    from:      { type: String, default: "" },
    to:        { type: String, default: "" },
    fromEmail: { type: String, default: "" },
    toEmail:   { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PriceHistory", PriceHistorySchema);
