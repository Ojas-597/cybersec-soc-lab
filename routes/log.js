const express = require("express");

const Log = require("../models/Logs");

const {
  isAuth,
  isAnalyst
} = require("../middleware/auth");

const router = express.Router();


/* =========================
   📡 GET LOGS
========================= */

router.get(
  "/logs",
  isAuth,
  isAnalyst,

  async (req, res) => {

    try {

      const logs =
        await Log.find()
        .sort({ time: -1 });

      res.json(logs);

    }

    catch (err) {

      console.error(err);

      res.status(500).send(
        "Failed to load logs"
      );

    }

  }

);


module.exports = router;
