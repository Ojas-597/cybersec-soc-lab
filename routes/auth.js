const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// 🔹 SIGNUP
router.post("/signup", async (req, res) => {

  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.send("❌ All fields required");
  }

  if (password.length < 6) {
    return res.send("❌ Password must be at least 6 characters");
  }

  // 🔍 check duplicate user
  const exists = await User.findOne({ username });
  if (exists) {
    return res.send("❌ User already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hash,
    role: role || "user"
  });

  res.send("✅ Registration Success");
});


// 🔹 LOGIN
router.post("/login", async (req, res) => {

  const user = await User.findOne({ username: req.body.username });

  if (!user) return res.send("❌ User not found");

  const ok = await bcrypt.compare(req.body.password, user.password);

  if (!ok) return res.send("❌ Wrong password");

  req.session.user = user;

  res.redirect("/dashboard.html");
});


// 🔹 CURRENT USER
router.get("/me", (req, res) => {
  res.json(req.session.user || null);
});


// 🔹 LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login.html");
});


// 🔹 ADMIN USERS
router.get("/users", async (req, res) => {
  if (req.session.user?.role !== "admin") return res.send("Denied");
  res.json(await User.find());
});


// 🔹 DELETE USER
router.get("/delete/:id", async (req, res) => {
  if (req.session.user?.role !== "admin") return res.send("Denied");
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/admin.html");
});


// 🔹 STATS
router.get("/stats", async (req, res) => {
  const users = await User.countDocuments();
  const logs = await require("../models/Log").countDocuments();

  res.json({
    users,
    logs,
    topAttack: "SQL Injection"
  });
});

module.exports = router;
