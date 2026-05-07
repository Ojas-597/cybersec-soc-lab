require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static("public"));

/* ================= DB ================= */
mongoose.connect("mongodb://127.0.0.1:27017/soc_master");

const Log = mongoose.model("Log", {
  user: String,
  type: String,
  severity: String,
  time: Date
});

/* ================= AUTH ================= */
function auth(req,res,next){
  const token = req.headers.authorization;
  if(!token) return res.status(401).send("No token");

  try{
    req.user = jwt.verify(token.split(" ")[1], "SECRET");
    next();
  }catch(e){
    res.status(401).send("Invalid token");
  }
}

/* ================= AI ENGINE ================= */
app.post("/ask", auth, (req,res)=>{

  const q = req.body.question.toLowerCase();

  let result = [];

  function emit(type, severity){

    io.emit("soc_event", {
      user: req.user.username,
      type,
      severity,
      time: new Date()
    });

    Log.create({
      user: req.user.username,
      type,
      severity,
      time: new Date()
    });

  }

  if(q.includes("sql")){
    result.push({
      attack:"SQL Injection",
      severity:"HIGH",
      tool:"SQLMap",
      solution:"Use prepared statements",
      confidence:"90%"
    });
    emit("SQL Injection","HIGH");
  }

  else if(q.includes("xss")){
    result.push({
      attack:"XSS Attack",
      severity:"MEDIUM",
      tool:"Burp Suite",
      solution:"Sanitize input + CSP",
      confidence:"85%"
    });
    emit("XSS Attack","MEDIUM");
  }

  else if(q.includes("ddos")){
    result.push({
      attack:"DDoS Attack",
      severity:"CRITICAL",
      tool:"Cloudflare",
      solution:"Rate limiting + CDN",
      confidence:"95%"
    });
    emit("DDoS Attack","CRITICAL");
  }

  else{
    result.push({
      attack:"Unknown Threat",
      severity:"LOW",
      tool:"AI Engine",
      solution:"Manual analysis required",
      confidence:"70%"
    });
  }

  res.json(result);
});

/* ================= LAB ================= */
app.post("/lab/run", auth, (req,res)=>{

  const { type } = req.body;

  let severity = "LOW";
  if(type==="sql") severity="HIGH";
  if(type==="ddos") severity="CRITICAL";
  if(type==="xss") severity="MEDIUM";

  const event = {
    user:req.user.username,
    type,
    severity,
    time:new Date()
  };

  Log.create(event);
  io.emit("soc_event", event);

  res.json(event);
});

/* ================= STATS ================= */
app.get("/stats", auth, async (req,res)=>{

  const total = await Log.countDocuments();
  const high = await Log.countDocuments({severity:"HIGH"});
  const critical = await Log.countDocuments({severity:"CRITICAL"});

  res.json({total, high, critical});
});

/* ================= LOGS ================= */
app.get("/logs", auth, async (req,res)=>{

  const logs = await Log.find().sort({time:-1}).limit(100);
  res.json(logs);
});

/* ================= SOCKET ================= */
io.on("connection", socket=>{
  console.log("SOC analyst connected");
});

/* ================= START ================= */
server.listen(3000, ()=>{
  console.log("MASTER SOC RUNNING");
});
