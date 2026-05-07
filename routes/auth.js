const express = require("express");

const bcrypt = require("bcrypt");

const User = require("../models/User");

const Log = require("../models/Logs");

const router = express.Router();


/* =========================
   📝 SIGNUP
========================= */

router.post("/signup", async (req, res) => {

  try {

    const {
      username,
      password,
      role
    } = req.body;


    /* =========================
       VALIDATION
    ========================= */

    if (!username || !password) {

      return res.status(400).send(
        "All fields required"
      );

    }


    /* =========================
       CHECK EXISTING USER
    ========================= */

    const exists = await User.findOne({
      username
    });


    if (exists) {

      return res.status(400).send(
        "User already exists"
      );

    }


    /* =========================
       HASH PASSWORD
    ========================= */

    const hash = await bcrypt.hash(
      password,
      10
    );


    /* =========================
       CREATE USER
    ========================= */

    const newUser = await User.create({

      username,

      password: hash,

      role: role || "user"

    });


    console.log(
      "✅ User created:",
      newUser.username
    );


    /* =========================
       CREATE LOG
    ========================= */

    await Log.create({

      message:
        `New user registered: ${username}`,

       level: results[0].severity

    });


    /* =========================
       REDIRECT
    ========================= */

    res.redirect("/login.html");

  } catch (err) {

    console.error(
      "❌ SIGNUP ERROR:"
    );

    console.error(err);

    res.status(500).send(
      err.message
    );

  }

});


/* =========================
   🔐 LOGIN
========================= */

router.post("/login", async (req, res) => {

  try {

    const {
      username,
      password
    } = req.body;


    /* =========================
       FIND USER
    ========================= */

    const user = await User.findOne({
      username
    });


    if (!user) {

      return res.status(404).send(
        "User not found"
      );

    }


    /* =========================
       CHECK PASSWORD
    ========================= */

    const ok = await bcrypt.compare(
      password,
      user.password
    );


    if (!ok) {

      return res.status(401).send(
        "Wrong password"
      );

    }


    /* =========================
       SAVE SESSION
    ========================= */

    req.session.user = {

      id: user._id,

      username: user.username,

      role: user.role

    };


    console.log(
      "✅ Login successful:",
      user.username
    );


    /* =========================
       LOGIN LOG
    ========================= */

    await Log.create({

      message:
        `User logged in: ${user.username}`,

      level: "INFO"

    });


    /* =========================
       REDIRECT
    ========================= */

    res.redirect("/dashboard.html");

  } catch (err) {

    console.error(
      "❌ LOGIN ERROR:"
    );

    console.error(err);

    res.status(500).send(
      err.message
    );

  }

});


/* =========================
   🚪 LOGOUT
========================= */

router.get("/logout", (req, res) => {

  req.session.destroy((err) => {

    if (err) {

      console.error(
        "❌ Logout Error:"
      );

      console.error(err);

      return res.send(
        "Logout failed"
      );

    }

    res.redirect("/login.html");

  });

});


module.exports = router;
