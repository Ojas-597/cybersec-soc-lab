const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Log = require("../models/Logs");

const { isAuth, isAdmin } = require("../middleware/auth");

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

  await Log.create({
    message: `New user registered: ${username}`,
    level: "INFO"
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

  await Log.create({
    message: `User logged in: ${user.username}`,
    level: "INFO"
  });

  res.redirect("/dashboard.html");
});


// 🔹 CURRENT USER
router.get("/me", isAuth, (req, res) => {
  res.json(req.session.user);
});


// 🔹 LOGOUT
router.get("/logout", isAuth, (req, res) => {
  req.session.destroy();
  res.redirect("/login.html");
});


// 🔹 ADMIN: GET USERS
router.get("/users", isAuth, isAdmin, async (req, res) => {
  res.json(await User.find());
});


// 🔹 ADMIN: DELETE USER
router.get("/delete/:id", isAuth, isAdmin, async (req, res) => {

  await User.findByIdAndDelete(req.params.id);

  await Log.create({
    message: `User deleted: ${req.params.id}`,
    level: "WARNING"
  });

  res.redirect("/admin.html");
});


// 🔹 STATS
router.get("/stats", isAuth, async (req, res) => {

  const users = await User.countDocuments();
  const logs = await Log.countDocuments();

  res.json({
    users,
    logs,
    topAttack: "SQL Injection"
  });
});

module.exports = router;
