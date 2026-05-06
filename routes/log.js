const express = require("express");
const Log = require("../models/Logs");

const { isAuth, isAnalyst } = require("../middleware/auth");

const router = express.Router();


// ➕ ADD LOG
router.post("/log", isAuth, async (req, res) => {

  await Log.create(req.body);

  res.send("Log added");
});


// 📊 VIEW LOGS (Analyst/Admin only)
router.get("/logs", isAuth, isAnalyst, async (req, res) => {

  const logs = await Log.find().sort({ time: -1 });

  res.json(logs);
});

module.exports = router;
