window.attacks = {

  "SQL Injection": {
    severity: "HIGH",
    riskScore: 9,

    category: "Web Attack",

    definition: "Injection of malicious SQL queries into application inputs.",

    tools: [
      "SQLmap",
      "Burp Suite"
    ],

    solution: "Use prepared statements and input validation."
  },


  "Port Scanning": {
    severity: "MEDIUM",
    riskScore: 6,

    category: "Network Reconnaissance",

    definition: "Scanning target systems for open ports and services.",

    tools: [
      "Nmap"
    ],

    solution: "Close unused ports and configure firewalls."
  },


  "Phishing": {
    severity: "HIGH",
    riskScore: 8,

    category: "Social Engineering",

    definition: "Fake emails or websites used to steal credentials or sensitive data.",

    tools: [
      "SET Toolkit"
    ],

    solution: "Conduct user awareness training and email filtering."
  }

};
