const express = require("express");
const Log = require("../models/Logs");

const { isAuth, isAnalyst } = require("../middleware/auth");

const router = express.Router();


/* =========================
   ➕ ADD LOG
========================= */
router.post("/log", isAuth, async (req, res) => {

  try {

    const log = await Log.create({
      message: req.body.message,
      level: req.body.level || "INFO"
    });

    res.json({
      success: true,
      log
    });

  } catch (err) {

    console.error("❌ ADD LOG ERROR:");
    console.error(err);

    res.status(500).send(err.message);
  }

});


/* =========================
   📊 VIEW LOGS
========================= */
router.get("/logs", isAuth, isAnalyst, async (req, res) => {

  try {

    const logs = await Log.find().sort({ time: -1 });

    res.json(logs);

  } catch (err) {

    console.error("❌ FETCH LOGS ERROR:");
    console.error(err);

    res.status(500).send(err.message);
  }

});


module.exports = router;
