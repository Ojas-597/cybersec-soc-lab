require("dotenv").config(); // 🔐 Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();

/* =========================
   🔐 MIDDLEWARE
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET, // 🔐 from .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false // set true if using HTTPS
  }
}));

/* =========================
   🌐 STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   🗄️ MONGODB CONNECTION
========================= */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

/* =========================
   📦 ROUTES
========================= */
const authRoutes = require("./routes/auth");
const queryRoutes = require("./routes/query");
const logRoutes = require("./routes/log");

app.use("/", authRoutes);
app.use("/", queryRoutes);
app.use("/", logRoutes);

/* =========================
   🧪 HEALTH CHECK
========================= */
app.get("/test", (req, res) => {
  res.send("🚀 SOC Lab Server Running");
});

/* =========================
   ⚠️ ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).send("Internal Server Error");
});

/* =========================
   🚀 START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
