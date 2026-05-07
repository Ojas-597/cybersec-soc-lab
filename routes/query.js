const express = require("express");

const Query = require("../models/Query");

const Log = require("../models/Logs");

const {
  isAuth
} = require("../middleware/auth");

const router = express.Router();


/* =========================
   🤖 AI THREAT ANALYZER
========================= */

router.post("/ask", isAuth, async (req, res) => {

  try {

    if (!req.body.question) {

      return res.status(400).send(
        "Question required"
      );

    }


    let q =
      req.body.question.toLowerCase();

    let results = [];


    /* =========================
       SQL INJECTION
    ========================= */

    if (
      q.includes("login") ||
      q.includes("bypass") ||
      q.includes("sql")
    ) {

      results.push({

        attack: "SQL Injection",

        severity: "HIGH",

        tool:
          "Burp Suite / SQLmap",

        solution:
          "Use prepared statements",

        confidence: "85%"

      });

    }


    /* =========================
       PHISHING
    ========================= */

    if (
      q.includes("phishing") ||
      q.includes("fake email")
    ) {

      results.push({

        attack: "Phishing",

        severity: "HIGH",

        tool:
          "SET Toolkit",

        solution:
          "User awareness training",

        confidence: "80%"

      });

    }


    /* =========================
       PORT SCAN
    ========================= */

    if (
      q.includes("port") ||
      q.includes("open port") ||
      q.includes("scan")
    ) {

      results.push({

        attack: "Port Scanning",

        severity: "MEDIUM",

        tool: "Nmap",

        solution:
          "Close unused ports",

        confidence: "70%"

      });

    }


    /* =========================
       NETWORK TRAFFIC
    ========================= */

    if (
      q.includes("traffic") ||
      q.includes("slow") ||
      q.includes("sniff")
    ) {

      results.push({

        attack: "Packet Sniffing",

        severity: "MEDIUM",

        tool: "Wireshark",

        solution:
          "Monitor suspicious packets",

        confidence: "65%"

      });

    }


    /* =========================
       UNKNOWN
    ========================= */

    if (results.length === 0) {

      results.push({

        attack: "Unknown Threat",

        severity: "LOW",

        tool: "Nmap",

        solution:
          "Perform detailed investigation",

        confidence: "40%"

      });

    }


    /* =========================
       SAVE QUERY
    ========================= */

    await Query.create({

      user:
        req.session.user.username,

      question:
        req.body.question,

      response:
        JSON.stringify(results)

    });


    /* =========================
       SAVE LOG
    ========================= */

    await Log.create({

      message:
        `Threat analyzed for ${req.session.user.username}: ${results.map(r => r.attack).join(", ")}`,

      level:
        results[0].severity

    });


    console.log(
      `🚨 Threat detected: ${results[0].attack}`
    );


    res.json(results);

  }

  catch (err) {

    console.error(
      "❌ QUERY ERROR"
    );

    console.error(err);

    res.status(500).send(
      "Server Error"
    );

  }

});


module.exports = router;
