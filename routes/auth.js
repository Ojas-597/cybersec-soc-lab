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


    if (!username || !password) {

      return res.send(
        "All fields required"
      );

    }


    const existingUser =
      await User.findOne({
        username
      });


    if (existingUser) {

      return res.send(
        "User already exists"
      );

    }


    const hashedPassword =
      await bcrypt.hash(password, 10);


    await User.create({

      username,

      password: hashedPassword,

      role: role || "user"

    });


    await Log.create({

      message:
        `New user registered: ${username}`,

      level: "INFO"

    });


    console.log(
      `✅ Signup successful: ${username}`
    );


    res.redirect("/login.html");

  }

  catch (err) {

    console.error(
      "❌ SIGNUP ERROR"
    );

    console.error(err);

    res.send("Signup error");

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


    const user =
      await User.findOne({
        username
      });


    if (!user) {

      return res.send(
        "User not found"
      );

    }


    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!validPassword) {

      return res.send(
        "Wrong password"
      );

    }


    req.session.user = {

      id: user._id,

      username: user.username,

      role: user.role

    };


    await Log.create({

      message:
        `User logged in: ${user.username}`,

      level: "INFO"

    });


    console.log(
      `✅ Login successful: ${user.username}`
    );


    res.redirect("/dashboard.html");

  }

  catch (err) {

    console.error(
      "❌ LOGIN ERROR"
    );

    console.error(err);

    res.send("Login error");

  }

});


/* =========================
   👤 CURRENT USER
========================= */

router.get("/me", (req, res) => {

  if (!req.session.user) {

    return res.status(401).json({

      loggedIn: false

    });

  }


  res.json({

    loggedIn: true,

    user: req.session.user

  });

});


/* =========================
   🚪 LOGOUT
========================= */

router.get("/logout", (req, res) => {

  req.session.destroy(() => {

    res.redirect("/login.html");

  });

});


module.exports = router;
