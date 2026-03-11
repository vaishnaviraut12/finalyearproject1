const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    email:    { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, default: "" },
    bio:      { type: String, default: "" },
    avatar:   { type: String, default: "" },
    banner:   { type: String, default: "" },
    twitter:  { type: String, default: "" },
    instagram:{ type: String, default: "" },
    discord:  { type: String, default: "" },
    wallet:   { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);