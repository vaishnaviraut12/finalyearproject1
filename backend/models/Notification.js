const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, lowercase: true },
    type:      { type: String, enum: ["Minted", "Sold", "Purchased", "NewListing"], required: true },
    message:   { type: String, required: true },
    nftName:   { type: String, default: "" },
    nftImage:  { type: String, default: "" },
    price:     { type: String, default: "" },
    tokenId:   { type: String, default: "" },
    read:      { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);