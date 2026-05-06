🛡️ CyberSec SOC Lab – Vulnerability Analysis & Attack Simulation Platform

📌 Project Overview

CyberSec SOC Lab is a full-stack cybersecurity learning and simulation platform designed to mimic a Security Operations Center (SOC) environment.

It allows users to:

🔍 Search vulnerabilities (Wikipedia-style)
🤖 Analyze security issues using an AI-like system
🧪 Simulate cyber attacks safely
📊 Monitor logs and system activity
📄 Generate security reports

This project integrates penetration testing concepts into an interactive web-based platform.

🎯 Objectives
To build a practical cybersecurity lab
To simulate real-world attacks in a safe environment
To implement role-based access control (RBAC)
To provide hands-on learning for penetration testing
To demonstrate SOC monitoring & analysis workflows

🧠 Key Features
🔐 Authentication System
Secure login & registration
Password hashing using bcrypt
Session-based authentication

👥 Role-Based Access Control (RBAC)
Role	Permissions
👤 User	Search, Query, Simulation
🧪 Analyst	View logs + user features
👑 Admin	Full system control

✔ Middleware-based access control
✔ Secure route protection

🤖 AI-like Attack Recommendation System

Users can input problems like:

“Login bypass issue”

System detects:

Attack type
Recommended tools
Solution

Example output:

Attack: SQL Injection
Tool: Burp Suite / SQLmap
Solution: Use prepared statements

🔍 Vulnerability Search (Wikipedia Style)
Search for:
SQL Injection
Phishing
Port Scanning
Sniffing
Dynamic results with links to lab simulations
🧪 Attack Simulation Lab

Each attack page includes:

📖 Definition
⚙️ How it works
🌍 Real-world case
💻 Commands (Nmap, SQLmap, etc.)
📟 Simulated output
🛡️ Prevention methods

📊 SOC Logging System
Tracks:
Logins
Queries
Admin actions
Role-based viewing (Analyst/Admin)

Example:

[INFO] User logged in
[WARNING] User deleted

📄 Report Generator

Generates structured reports:

Attack: SQL Injection
Impact: High
Solution: Use prepared statements

🧠 Quiz System
Basic cybersecurity MCQ
Helps reinforce knowledge

📂 Evidence Upload (Simulation)
Upload logs/screenshots (basic simulation)
Demonstrates incident reporting concept

🧱 Project Architecture
cybersec-soc-lab/
│
├── data/            → Attack knowledge base
├── middleware/      → RBAC security logic
├── models/          → MongoDB schemas
├── routes/          → Backend logic
├── public/          → Frontend (HTML/CSS/JS)
│
├── server.js        → Main server
├── package.json     → Dependencies
└── README.md

⚙️ Technologies Used

Backend
Node.js
Express.js
MongoDB (Mongoose)

Frontend
HTML
CSS
JavaScript

Security Concepts
RBAC (Role-Based Access Control)
Password Hashing (bcrypt)
Session Management

🚀 How to Run the Project
1️⃣ Install Dependencies
npm install
2️⃣ Start MongoDB
mongod
3️⃣ Run Server
node server.js
4️⃣ Open in Browser
http://localhost:3000

🔐 Default Workflow
Register user
Login
Access dashboard
Search vulnerabilities
Ask AI system
Simulate attacks
View logs (analyst/admin)

📊 Example Use Case

User enters:

“My website login is bypassed”

System response:

Attack: SQL Injection
Tool: SQLmap
Solution: Prepared statements

🧠 Learning Outcomes
Understanding of penetration testing tools:
Nmap
Wireshark
Metasploit
Knowledge of:
SQL Injection
Phishing
Sniffing
Port scanning
SOC workflow simulation
Secure web development practices

🔮 Future Enhancements

🌐 Deploy online (Render / Railway)
📊 Graph-based analytics dashboard
📧 Email alerts system
🔐 OTP authentication
🤖 Real AI integration (OpenAI API)
📁 Real file upload processing

⚠️ Disclaimer

This project is developed strictly for educational purposes only.
All attack simulations are performed in a controlled environment.

👨‍💻 Author

Ojaswita Desai 

⭐ Conclusion

CyberSec SOC Lab demonstrates how:

Cyber attacks can be identified
Systems can be analyzed
Vulnerabilities can be mitigated

It bridges the gap between theoretical learning and practical implementation.
