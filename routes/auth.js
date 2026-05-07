const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Log = require("../models/Logs");

const router = express.Router();


// ==========================
// SIGNUP
// ==========================
router.post("/signup", async (req, res) => {

  try {

    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.send("All fields required");
    }

    const exists = await User.findOne({ username });

    if (exists) {
      return res.send("User already exists");
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hash,
      role: role || "user"
    });

    await Logs.create({
      message: `New user registered: ${username}`,
      level: "INFO"
    });

    // ✅ REDIRECT
    res.redirect("/login.html");

  } catch (err) {
    console.log(err);
    res.send("Signup error");
  }

});


// ==========================
// LOGIN
// ==========================
router.post("/login", async (req, res) => {

  try {

    const user = await User.findOne({
      username: req.body.username
    });

    if (!user) {
      return res.send("User not found");
    }

    const ok = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!ok) {
      return res.send("Wrong password");
    }

    req.session.user = user;

    await Log.create({
      message: `User logged in: ${user.username}`,
      level: "INFO"
    });

    // ✅ REDIRECT
    res.redirect("/dashboard.html");

  } catch (err) {
    console.log(err);
    res.send("Login error");
  }

});


// ==========================
// LOGOUT
// ==========================
router.get("/logout", (req, res) => {

  req.session.destroy();

  res.redirect("/login.html");
});

module.exports = router;
