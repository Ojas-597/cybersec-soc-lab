const express = require("express");
const Query = require("../models/Query");
const Log = require("../models/Logs");

const { isAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/ask", isAuth, async (req, res) => {

  let q = req.body.question.toLowerCase();

  let results = [];

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

  if (results.length === 0) {
    results.push({
      attack: "Unknown",
      tool: "Nmap",
      solution: "Perform scan",
      confidence: "40%"
    });
  }

  // 💾 Save Query
  await Query.create({
    user: req.session.user.username,
    question: req.body.question,
    response: JSON.stringify(results)
  });

  // 📊 Log
  await Log.create({
    message: `Query by ${req.session.user.username}: ${results.map(r => r.attack).join(", ")}`,
    level: "INFO"
  });

  res.json(results);
});

module.exports = router;
