const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/User");
// const Log = require("../models/Logs"); // TEMPORARILY DISABLED

const router = express.Router();


/* =========================
   📝 SIGNUP
========================= */
router.post("/signup", async (req, res) => {

  try {

    const { username, password, role } = req.body;

    // Validation
    if (!username || !password) {
      return res.send("All fields required");
    }

    // Check existing user
    const exists = await User.findOne({ username });

    if (exists) {
      return res.send("User already exists");
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      password: hash,
      role: role || "user"
    });

    console.log("✅ User created:", newUser.username);

    // TEMPORARILY DISABLED
    /*
    await Log.create({
      message: `New user registered: ${username}`,
      level: "INFO"
    });
    */

    // Redirect to login
    res.redirect("/login.html");

  } catch (err) {

    console.error("❌ SIGNUP ERROR:");
    console.error(err);

    res.status(500).send(err.message);
  }

});


/* =========================
   🔐 LOGIN
========================= */
router.post("/login", async (req, res) => {

  try {

    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.send("User not found");
    }

    // Compare password
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.send("Wrong password");
    }

    // Store session
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    console.log("✅ Login successful:", user.username);

    // TEMPORARILY DISABLED
    /*
    await Log.create({
      message: `User logged in: ${user.username}`,
      level: "INFO"
    });
    */

    // Redirect
    res.redirect("/dashboard.html");

  } catch (err) {

    console.error("❌ LOGIN ERROR:");
    console.error(err);

    res.status(500).send(err.message);
  }

});


/* =========================
   🚪 LOGOUT
========================= */
router.get("/logout", (req, res) => {

  req.session.destroy((err) => {

    if (err) {
      console.error("❌ Logout Error:", err);
      return res.send("Logout failed");
    }

    res.redirect("/login.html");
  });

});


module.exports = router;
