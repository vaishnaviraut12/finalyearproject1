const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ─── DEBUG: log every incoming request ────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── ROUTES ───────────────────────────────────────────────────
app.use("/api/auth",    require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/nfts",    require("./routes/nfts"));
app.use("/api/history",       require("./routes/priceHistory"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/public",         require("./routes/publicProfile"));

// ─── HEALTH CHECK ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "✅ NFT Marketplace API is running" });
});

// ─── 404 CATCH-ALL ────────────────────────────────────────────
app.use((req, res) => {
  console.error(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// ─── CONNECT DB & START ───────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log("📡 Routes registered:");
      console.log("   POST   /api/auth/register");
      console.log("   POST   /api/auth/login");
      console.log("   GET    /api/profile/:email");
      console.log("   POST   /api/profile/save");
      console.log("   GET    /api/nfts/:email");
      console.log("   POST   /api/nfts/save");
      console.log("   POST   /api/nfts/transfer");
      console.log("   DELETE /api/nfts/:tokenId");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });