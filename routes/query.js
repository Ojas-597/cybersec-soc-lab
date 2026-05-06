const express = require("express");
const Query = require("../models/Query");
const Log = require("../models/Log");

const router = express.Router();

router.post("/ask", async (req, res) => {
  let q = req.body.question.toLowerCase();

  let results = [];

  // 🔴 SQL Injection
  if (q.includes("login") || q.includes("bypass")) {
    results.push({
      attack: "SQL Injection",
      tool: "Burp Suite / SQLmap",
      solution: "Use prepared statements",
      confidence: "80%"
    });
  }

  // 🟡 Sniffing
  if (q.includes("slow") || q.includes("traffic")) {
    results.push({
      attack: "Sniffing",
      tool: "Wireshark",
      solution: "Analyze packets",
      confidence: "60%"
    });
  }

  // 🔵 Port Scanning
  if (q.includes("port") || q.includes("open")) {
    results.push({
      attack: "Port Scanning",
      tool: "Nmap",
      solution: "Close unused ports",
      confidence: "70%"
    });
  }

  // 🟣 Phishing
  if (q.includes("phishing") || q.includes("email")) {
    results.push({
      attack: "Phishing",
      tool: "Social Engineering Toolkit",
      solution: "User awareness training",
      confidence: "75%"
    });
  }

  // ⚪ Default
  if (results.length === 0) {
    results.push({
      attack: "Unknown",
      tool: "Nmap",
      solution: "Perform full scan",
      confidence: "40%"
    });
  }

  // 💾 Save query
  await Query.create({
    user: req.session.user?.username || "guest",
    question: req.body.question,
    response: JSON.stringify(results)
  });

  // 📊 Log entry
  await Log.create({
    message: `Detected: ${results.map(r => r.attack).join(", ")}`,
    level: "INFO"
  });

  res.json(results);
});

module.exports = router;
