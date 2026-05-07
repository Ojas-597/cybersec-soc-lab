const express = require("express");

const Query = require("../models/Query");
const Log = require("../models/Logs");

const { isAuth } = require("../middleware/auth");

const router = express.Router();


/* =========================
   🔍 ASK QUERY
========================= */
router.post("/ask", isAuth, async (req, res) => {

  try {

    // Validate input
    if (!req.body.question) {
      return res.status(400).send("Question is required");
    }

    let q = req.body.question.toLowerCase();

    let results = [];

    /* =========================
       🛡️ ATTACK DETECTION
    ========================= */

    if (q.includes("login") || q.includes("bypass")) {

      results.push({
        attack: "SQL Injection",
        tool: "Burp Suite / SQLmap",
        solution: "Use prepared statements",
        confidence: "80%"
      });

    }

    if (q.includes("slow") || q.includes("traffic")) {

      results.push({
        attack: "Sniffing",
        tool: "Wireshark",
        solution: "Analyze packets",
        confidence: "60%"
      });

    }

    if (q.includes("port") || q.includes("open")) {

      results.push({
        attack: "Port Scanning",
        tool: "Nmap",
        solution: "Close unused ports",
        confidence: "70%"
      });

    }

    if (q.includes("phishing")) {

      results.push({
        attack: "Phishing",
        tool: "Social Engineering Toolkit",
        solution: "User awareness",
        confidence: "75%"
      });

    }

    // Default response
    if (results.length === 0) {

      results.push({
        attack: "Unknown",
        tool: "Nmap",
        solution: "Perform scan",
        confidence: "40%"
      });

    }

    /* =========================
       💾 SAVE QUERY
    ========================= */

    await Query.create({
      user: req.session.user.username,
      question: req.body.question,
      response: JSON.stringify(results)
    });

    /* =========================
       📊 SAVE LOG
    ========================= */

    // TEMPORARILY SAFE VERSION
    try {

      await Log.create({
        message: `Query by ${req.session.user.username}: ${results.map(r => r.attack).join(", ")}`,
        level: "INFO"
      });

    } catch (logErr) {

      console.error("⚠️ LOG SAVE ERROR:");
      console.error(logErr);

    }

    /* =========================
       ✅ RESPONSE
    ========================= */

    res.json(results);

  } catch (err) {

    console.error("❌ QUERY ERROR:");
    console.error(err);

    res.status(500).send(err.message);
  }

});


module.exports = router;
