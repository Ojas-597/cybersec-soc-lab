/* =================================================
   ENTERPRISE SOC ATTACK DATASET
================================================= */

module.exports = [

/* =================================================
   SQL INJECTION
================================================= */

{
  keyword: "sql",

  attack: "SQL Injection",

  severity: "HIGH",

  tool: "SQLMap",

  solution:
    "Use prepared statements, parameterized queries, and database input validation.",

  confidence: "92%",

  category: "Web Application Attack"
},

{
  keyword: "database",

  attack: "Database Exploitation",

  severity: "HIGH",

  tool: "MySQL Audit / SQLMap",

  solution:
    "Restrict database permissions and enable secure query handling.",

  confidence: "88%",

  category: "Database Security"
},

/* =================================================
   XSS
================================================= */

{
  keyword: "xss",

  attack: "Cross Site Scripting (XSS)",

  severity: "MEDIUM",

  tool: "Burp Suite",

  solution:
    "Sanitize inputs, encode output, and implement Content Security Policy (CSP).",

  confidence: "87%",

  category: "Web Application Attack"
},

{
  keyword: "script injection",

  attack: "JavaScript Injection Attack",

  severity: "MEDIUM",

  tool: "OWASP ZAP",

  solution:
    "Validate user input and prevent dynamic script execution.",

  confidence: "84%",

  category: "Client-Side Attack"
},

/* =================================================
   DDOS
================================================= */

{
  keyword: "ddos",

  attack: "Distributed Denial of Service (DDoS)",

  severity: "CRITICAL",

  tool: "Cloudflare / Wireshark",

  solution:
    "Enable rate limiting, CDN protection, and network traffic filtering.",

  confidence: "95%",

  category: "Network Attack"
},

{
  keyword: "flood",

  attack: "Traffic Flood Attack",

  severity: "CRITICAL",

  tool: "Snort IDS",

  solution:
    "Monitor abnormal traffic spikes and apply firewall filtering.",

  confidence: "91%",

  category: "Network Security"
},

/* =================================================
   PHISHING
================================================= */

{
  keyword: "phishing",

  attack: "Phishing Campaign",

  severity: "HIGH",

  tool: "Email Header Analyzer",

  solution:
    "Conduct security awareness training and verify suspicious emails.",

  confidence: "90%",

  category: "Social Engineering"
},

{
  keyword: "fake email",

  attack: "Email Spoofing",

  severity: "HIGH",

  tool: "SPF/DKIM Analyzer",

  solution:
    "Enable SPF, DKIM, and DMARC email protection policies.",

  confidence: "89%",

  category: "Email Security"
},

/* =================================================
   BRUTE FORCE
================================================= */

{
  keyword: "brute",

  attack: "Brute Force Login Attempt",

  severity: "HIGH",

  tool: "Fail2Ban",

  solution:
    "Enable MFA and account lockout policies.",

  confidence: "91%",

  category: "Authentication Attack"
},

{
  keyword: "password attack",

  attack: "Credential Attack",

  severity: "HIGH",

  tool: "Hydra",

  solution:
    "Use strong password policies and rate limiting.",

  confidence: "86%",

  category: "Authentication Security"
},

/* =================================================
   MALWARE
================================================= */

{
  keyword: "malware",

  attack: "Malware Infection",

  severity: "CRITICAL",

  tool: "Windows Defender / VirusTotal",

  solution:
    "Isolate infected systems and perform malware scans immediately.",

  confidence: "94%",

  category: "Endpoint Security"
},

{
  keyword: "virus",

  attack: "Virus Detection",

  severity: "HIGH",

  tool: "Antivirus Scanner",

  solution:
    "Update antivirus signatures and quarantine infected files.",

  confidence: "88%",

  category: "Endpoint Protection"
},

/* =================================================
   RANSOMWARE
================================================= */

{
  keyword: "ransomware",

  attack: "Ransomware Attack",

  severity: "CRITICAL",

  tool: "EDR Solution",

  solution:
    "Disconnect affected systems and restore backups securely.",

  confidence: "96%",

  category: "Critical Threat"
},

/* =================================================
   MITM
================================================= */

{
  keyword: "mitm",

  attack: "Man-in-the-Middle Attack",

  severity: "HIGH",

  tool: "Wireshark",

  solution:
    "Use HTTPS, VPNs, and encrypted communication channels.",

  confidence: "89%",

  category: "Network Security"
},

/* =================================================
   WIFI ATTACK
================================================= */

{
  keyword: "wifi",

  attack: "Wireless Network Attack",

  severity: "MEDIUM",

  tool: "Aircrack-ng",

  solution:
    "Enable WPA3 encryption and secure wireless credentials.",

  confidence: "82%",

  category: "Wireless Security"
},

/* =================================================
   PORT SCANNING
================================================= */

{
  keyword: "port scan",

  attack: "Port Scanning Activity",

  severity: "LOW",

  tool: "Nmap",

  solution:
    "Close unused ports and monitor reconnaissance activity.",

  confidence: "80%",

  category: "Reconnaissance"
},

/* =================================================
   TROJAN
================================================= */

{
  keyword: "trojan",

  attack: "Trojan Malware",

  severity: "HIGH",

  tool: "Malwarebytes",

  solution:
    "Remove infected files and analyze persistence mechanisms.",

  confidence: "90%",

  category: "Endpoint Threat"
},

/* =================================================
   PRIVILEGE ESCALATION
================================================= */

{
  keyword: "privilege escalation",

  attack: "Privilege Escalation Attempt",

  severity: "CRITICAL",

  tool: "Sysmon / SIEM",

  solution:
    "Apply least privilege principles and monitor system changes.",

  confidence: "93%",

  category: "System Security"
},

/* =================================================
   DIRECTORY TRAVERSAL
================================================= */

{
  keyword: "directory traversal",

  attack: "Directory Traversal Attack",

  severity: "HIGH",

  tool: "Burp Suite",

  solution:
    "Restrict file access permissions and sanitize paths.",

  confidence: "87%",

  category: "Web Security"
},

/* =================================================
   CSRF
================================================= */

{
  keyword: "csrf",

  attack: "Cross Site Request Forgery",

  severity: "MEDIUM",

  tool: "OWASP ZAP",

  solution:
    "Use CSRF tokens and validate authenticated requests.",

  confidence: "83%",

  category: "Web Application Security"
},

/* =================================================
   BOTNET
================================================= */

{
  keyword: "botnet",

  attack: "Botnet Activity",

  severity: "CRITICAL",

  tool: "Network IDS",

  solution:
    "Block malicious IPs and isolate infected hosts.",

  confidence: "94%",

  category: "Network Threat"
},

/* =================================================
   DEFAULT UNKNOWN
================================================= */

{
  keyword: "unknown",

  attack: "Unknown Threat",

  severity: "LOW",

  tool: "Manual Investigation",

  solution:
    "Perform detailed forensic and behavioral analysis.",

  confidence: "70%",

  category: "Unknown"
}

];
