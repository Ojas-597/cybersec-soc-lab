const express = require("express");
const Log = require("../models/Log");
const router = express.Router();

router.post("/log", async (req, res) => {
  await Log.create(req.body);
  res.send("log added");
});

router.get("/logs", async (req, res) => {
  if (!["admin","analyst"].includes(req.session.user?.role))
    return res.send("Denied");

  res.json(await Log.find());
});

module.exports = router;
