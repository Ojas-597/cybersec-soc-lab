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
  secret: "soclab-secret",
  resave: false,
  saveUninitialized: false
}));

/* =========================
   🌐 STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   🗄️ MONGODB CONNECTION (Atlas)
========================= */
mongoose.connect(
  "mongodb+srv://admin:<db_password>@cluster0.zrqcfpr.mongodb.net/?appName=Cluster0"
)
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
   🧪 TEST ROUTE
========================= */
app.get("/test", (req, res) => {
  res.send("🚀 SOC Lab Server Running");
});

/* =========================
   ⚠️ ERROR HANDLING
========================= */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server Error");
});

/* =========================
   🚀 START SERVER
========================= */
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
