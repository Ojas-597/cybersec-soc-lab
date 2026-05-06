const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

// signup
router.post("/signup", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);

  await User.create({
    username: req.body.username,
    password: hash,
    role: req.body.role || "user"
  });

  res.redirect("/login.html");
});

// login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.send("User not found");

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.send("Wrong password");

  req.session.user = user;
  res.redirect("/dashboard.html");
});

// current user
router.get("/me", (req, res) => {
  res.json(req.session.user || null);
});

// logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login.html");
});

// users (admin)
router.get("/users", async (req, res) => {
  if (req.session.user?.role !== "admin") return res.send("Denied");
  res.json(await User.find());
});

// delete user
router.get("/delete/:id", async (req, res) => {
  if (req.session.user?.role !== "admin") return res.send("Denied");
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/admin.html");
});

// stats
router.get("/stats", async (req, res) => {
  const users = await User.countDocuments();
  const logs = await require("../models/Log").countDocuments();

  res.json({ users, logs, topAttack: "SQL Injection" });
});

module.exports = router;
