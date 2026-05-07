const express = require("express");

const Query = require("../models/Query");
const Log = require("../models/Logs");

const { isAuth } = require("../middleware/auth");

const router = express.Router();


/* =========================
   🔍 AI THREAT ANALYZER
========================= */

router.post("/ask", isAuth, async (req, res) => {

  try {

    if (!req.body.question) {
      return res.status(400).send("Question required");
    }

    let q = req.body.question.toLowerCase();

    let results = [];


    /* =========================
       🚨 ATTACK DETECTION
    ========================= */

    if (q.includes("login") || q.includes("bypass")) {

      results.push({
        attack: "SQL Injection",
        severity: "HIGH",
        tool: "Burp Suite / SQLmap",
        solution: "Use prepared statements",
        confidence: "80%"
      });

    }

    if (q.includes("slow") || q.includes("traffic")) {

      results.push({
        attack: "Sniffing",
        severity: "MEDIUM",
        tool: "Wireshark",
        solution: "Analyze packets",
        confidence: "60%"
      });

    }

    if (q.includes("port") || q.includes("open")) {

      results.push({
        attack: "Port Scanning",
        severity: "MEDIUM",
        tool: "Nmap",
        solution: "Close unused ports",
        confidence: "70%"
      });

    }

    if (q.includes("phishing")) {

      results.push({
        attack: "Phishing",
        severity: "HIGH",
        tool: "SET Toolkit",
        solution: "User awareness training",
        confidence: "75%"
      });

    }


    /* =========================
       ❓ UNKNOWN
    ========================= */

    if (results.length === 0) {

      results.push({
        attack: "Unknown Threat",
        severity: "LOW",
        tool: "Nmap",
        solution: "Perform deeper investigation",
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

    await Log.create({

      message:
        `Threat detected for ${req.session.user.username}: ${results.map(r => r.attack).join(", ")}`,

        level: results[0].severity

    });


    /* =========================
       📡 REALTIME ALERT
    ========================= */

    const io = req.app.get("io");

    io.emit("new-threat", {

      attack: results[0].attack,

      severity: results[0].severity,

      confidence: results[0].confidence,

      time: new Date()

    });


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
