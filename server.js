require("dotenv").config();

```js
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const http = require("http");
const socketIo = require("socket.io");
const multer = require("multer");
const path = require("path");

const { auth, roleCheck } = require("./middleware/authMiddleware");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

/* ================= CONFIG ================= */
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

/* ================= DATABASE ================= */
mongoose.connect(process.env.mongodb+srv://admin:admin123@cluster0.zrqcfpr.mongodb.net/?appName=Cluster0)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

/* ================= MODELS ================= */
const Log = mongoose.model("Log", {

  user:String,
  type:String,
  severity:String,
  source:String,
  timestamp:Date

});

const QuizResult = mongoose.model("QuizResult", {

  user:String,
  score:Number,
  reviewedBy:String,
  feedback:String,
  timestamp:Date

});

const Upload = mongoose.model("Upload", {

  user:String,
  filename:String,
  description:String,
  timestamp:Date

});

/* ================= FILE STORAGE ================= */
const storage = multer.diskStorage({

  destination:(req,file,cb)=>{
    cb(null,"uploads/");
  },

  filename:(req,file,cb)=>{

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  }

});

const upload = multer({ storage });

/* ================= LOGIN ================= */
app.post("/login", (req,res)=>{

  const { username, role } = req.body;

  const token = jwt.sign(
    {
      username,
      role
    },
    process.env.JWT_SECRET,
    {
      expiresIn:"2h"
    }
  );

  res.json({
    token,
    role
  });

});

/* ================= CURRENT USER ================= */
app.get("/me", auth, (req,res)=>{

  res.json(req.user);

});

/* ================= CREATE SOC EVENT ================= */
async function createEvent(
  user,
  type,
  severity,
  source
){

  const event = {

    user,
    type,
    severity,
    source,
    timestamp:new Date()

  };

  await Log.create(event);

  io.emit("soc_event", event);

}

/* ================= AI QUERY ENGINE ================= */
app.post("/ask", auth, async (req,res)=>{

  const q = req.body.question.toLowerCase();

  let result = [];

  async function add(
    attack,
    severity,
    tool,
    solution,
    confidence
  ){

    result.push({
      attack,
      severity,
      tool,
      solution,
      confidence
    });

    await createEvent(
      req.user.username,
      attack,
      severity,
      "AI Query Engine"
    );

  }

  if(q.includes("sql")){

    await add(
      "SQL Injection",
      "HIGH",
      "SQLMap",
      "Use prepared statements",
      "92%"
    );

  }

  else if(q.includes("xss")){

    await add(
      "XSS Attack",
      "MEDIUM",
      "Burp Suite",
      "Sanitize input + CSP",
      "87%"
    );

  }

  else if(q.includes("ddos")){

    await add(
      "DDoS Attack",
      "CRITICAL",
      "Cloudflare",
      "Enable rate limiting + CDN",
      "95%"
    );

  }

  else{

    await add(
      "Unknown Threat",
      "LOW",
      "Manual Analysis",
      "Further investigation required",
      "70%"
    );

  }

  res.json(result);

});

/* ================= LAB SIMULATION ================= */
app.post("/lab/run", auth, async (req,res)=>{

  const { type } = req.body;

  let severity = "LOW";

  if(type === "sql") severity = "HIGH";
  if(type === "xss") severity = "MEDIUM";
  if(type === "ddos") severity = "CRITICAL";

  await createEvent(
    req.user.username,
    type,
    severity,
    "Attack Simulation Lab"
  );

  res.json({

    success:true,
    type,
    severity

  });

});

/* ================= FILE UPLOAD ================= */
app.post(
  "/upload",

  auth,

  upload.single("file"),

  async (req,res)=>{

    try{

      await Upload.create({

        user:req.user.username,
        filename:req.file.filename,
        description:req.body.description,
        timestamp:new Date()

      });

      await createEvent(
        req.user.username,
        "Evidence Upload",
        "MEDIUM",
        "Evidence Upload System"
      );

      res.json({

        success:true,
        filename:req.file.filename,
        description:req.body.description

      });

    }

    catch(err){

      res.status(500).json({
        error:"Upload failed"
      });

    }

  }
);

/* ================= QUIZ SUBMISSION ================= */
app.post("/quiz/submit", auth, async (req,res)=>{

  const { score } = req.body;

  await QuizResult.create({

    user:req.user.username,
    score,
    reviewedBy:"Pending Admin Review",
    feedback:"Awaiting evaluation",
    timestamp:new Date()

  });

  await createEvent(
    req.user.username,
    "Quiz Submission",
    "LOW",
    "Cybersecurity Training"
  );

  res.json({

    success:true,
    message:"Quiz submitted successfully"

  });

});

/* ================= ADMIN REVIEWS QUIZ ================= */
app.post(
  "/quiz/review/:id",

  auth,

  roleCheck("admin"),

  async (req,res)=>{

    const { feedback } = req.body;

    await QuizResult.findByIdAndUpdate(
      req.params.id,
      {
        reviewedBy:req.user.username,
        feedback
      }
    );

    res.json({
      success:true
    });

  }
);

/* ================= QUIZ RESULTS ================= */
app.get(
  "/quiz-results",

  auth,

  async (req,res)=>{

    /* ================= ADMIN GETS ALL ================= */
    if(req.user.role === "admin"){

      const results = await QuizResult.find()
      .sort({ timestamp:-1 });

      return res.json(results);

    }

    /* ================= USERS GET ONLY THEIR RESULTS ================= */
    const results = await QuizResult.find({
      user:req.user.username
    })
    .sort({ timestamp:-1 });

    res.json(results);

  }
);

/* ================= STATS ================= */
app.get("/stats", auth, async (req,res)=>{

  const total = await Log.countDocuments();

  const high = await Log.countDocuments({
    severity:"HIGH"
  });

  const critical = await Log.countDocuments({
    severity:"CRITICAL"
  });

  res.json({

    total,
    high,
    critical

  });

});

/* ================= LOGS ================= */
app.get(
  "/logs",

  auth,

  roleCheck("admin"),

  async (req,res)=>{

    const logs = await Log.find()
    .sort({ timestamp:-1 })
    .limit(100);

    res.json(logs);

  }
);

/* ================= REPORT DATA ================= */
app.get("/report/data", auth, async (req,res)=>{

  const logs = await Log.find()
  .sort({ timestamp:-1 });

  res.json(logs);

});

/* ================= USERS ================= */
app.get(
  "/users",

  auth,

  roleCheck("admin"),

  async (req,res)=>{

    res.json([

      {
        username:"admin",
        role:"admin"
      },

      {
        username:"analyst1",
        role:"analyst"
      },

      {
        username:"user1",
        role:"user"
      }

    ]);

  }
);

/* ================= SOCKET ================= */
io.on("connection", socket=>{

  console.log("SOC Analyst Connected");

});

/* ================= START ================= */
server.listen(process.env.PORT || 3000){

  console.log(
    "MASTER SOC SYSTEM RUNNING"
  );

});


