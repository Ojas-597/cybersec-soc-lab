const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if user exists
    const existing = await User.findOne({ username });
    if (existing) return res.send("User already exists");

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hash,
      role: "user"
    });

    res.redirect("/login.html");

  } catch (err) {
    res.send("Signup error");
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.send("User not found");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.send("Wrong password");

    req.session.user = user;
    res.redirect("/dashboard.html");

  } catch (err) {
    res.send("Login error");
  }
});

// ================= CURRENT USER =================
router.get("/me", (req, res) => {
  res.json(req.session.user || null);
});

// ================= LOGOUT =================
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login.html");
});

// ================= ADMIN: GET USERS =================
router.get("/users", async (req, res) => {
  try {
    if (req.session.user?.role !== "admin") {
      return res.send("Access denied");
    }

    const users = await User.find();
    res.json(users);

  } catch (err) {
    res.send("Error fetching users");
  }
});

// ================= ADMIN: DELETE USER =================
router.get("/delete/:id", async (req, res) => {
  try {
    if (req.session.user?.role !== "admin") {
      return res.send("Access denied");
    }

    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin.html");

  } catch (err) {
    res.send("Delete error");
  }
});

module.exports = router;
