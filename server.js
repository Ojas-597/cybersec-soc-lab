require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const http = require("http");
const socketIo = require("socket.io");
const multer = require("multer");
const path = require("path");

const { auth, roleCheck } =
require("./middleware/authMiddleware");

/* ================= CREATE LOG ================= */

app.post("/log-action", auth, async(req,res)=>{

try{

await Log.create({

user:req.user.username,

action:req.body.action,

severity:req.body.severity || "INFO"

});

res.json({

success:true

});

}

catch(err){

console.error(err);

res.status(500).json({

error:"Failed to create log"

});

}

});

const app = express();

const server =
http.createServer(app);

const io = socketIo(server);

/* ================= CONFIG ================= */

app.use(express.json());

app.use(express.urlencoded({
extended:true
}));

app.use(express.static("public"));

app.use(
"/uploads",
express.static("uploads")
);

/* ================= DATABASE ================= */

mongoose.connect(
process.env.MONGO_URI
)

.then(()=>{

console.log(
"MongoDB Connected"
);

})

.catch(err=>{

console.log(err);

});

/* ================= MODELS ================= */

const User = mongoose.model("User", {

username:String,
password:String,
role:String

});

const Log = mongoose.model("Log", {

user:String,
type:String,
severity:String,
source:String,
timestamp:Date

});

const Upload = mongoose.model("Upload", {

user:String,
filename:String,
description:String,
timestamp:Date

});

const QuizResult =
mongoose.model("QuizResult", {

user:String,
score:Number,
reviewedBy:String,
feedback:String,
timestamp:Date

});

/* ================= MULTER ================= */

const storage =
multer.diskStorage({

destination:(req,file,cb)=>{

cb(null,"uploads/");

},

filename:(req,file,cb)=>{

cb(

null,

Date.now() +
"-" +
file.originalname

);

}

});

const upload =
multer({ storage });

/* ================= CREATE EVENT ================= */

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

/* REALTIME */
io.emit("soc_event", event);

}

/* ================= SIGNUP ================= */

app.post("/signup", async (req,res)=>{

try{

const {
username,
password,
role
} = req.body;

/* EXISTING */
const existing =
await User.findOne({
username
});

if(existing){

return res.status(400).json({

error:"User already exists"

});

}

/* CREATE */
await User.create({

username,
password,
role

});

res.json({

success:true

});

}

catch(err){

res.status(500).json({

error:"Signup failed"

});

}

});

/* ================= LOGIN ================= */

app.post("/login", async (req,res)=>{

try{

const {
username,
password,
role
} = req.body;

const user =
await User.findOne({

username,
password,
role

});

if(!user){

return res.status(401).json({

error:"Invalid credentials"

});

}

/* TOKEN */
const token = jwt.sign({

username:user.username,
role:user.role

},

process.env.JWT_SECRET,

{

expiresIn:"2h"

});

/* EVENT */
await createEvent(

user.username,
"User Login",
"LOW",
"Authentication System"

);

res.json({

token,
role:user.role

});

}

catch(err){

res.status(500).json({

error:"Login failed"

});

}

});

/* ================= CURRENT USER ================= */

app.get("/me",

auth,

(req,res)=>{

res.json(req.user);

});

/* ================= STATS ================= */

app.get("/stats",

auth,

async (req,res)=>{

const total =
await Log.countDocuments();

const high =
await Log.countDocuments({

severity:"HIGH"

});

const critical =
await Log.countDocuments({

severity:"CRITICAL"

});

res.json({

total,
high,
critical

});

});

/* ================= AI QUERY ================= */

app.post("/ask",

auth,

async (req,res)=>{

const q =
req.body.question.toLowerCase();

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

"Cross Site Scripting",
"MEDIUM",
"Burp Suite",
"Sanitize user input",
"87%"

);

}

else if(q.includes("ddos")){

await add(

"DDoS Attack",
"CRITICAL",
"Cloudflare",
"Enable rate limiting",
"95%"

);

}

else{

await add(

"Unknown Threat",
"LOW",
"Manual Investigation",
"Perform further analysis",
"70%"

);

}

res.json(result);

});

/* ================= LAB ================= */

app.post("/lab/run",

auth,

async (req,res)=>{

const { type } =
req.body;

let severity = "LOW";

if(type==="sql")
severity="HIGH";

if(type==="xss")
severity="MEDIUM";

if(type==="ddos")
severity="CRITICAL";

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

/* ================= UPLOAD ================= */

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
"Upload System"

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

/* ================= QUIZ SUBMIT ================= */

app.post(

"/quiz/submit",

auth,

async (req,res)=>{

const { score } =
req.body;

await QuizResult.create({

user:req.user.username,

score,

reviewedBy:
"Pending Review",

feedback:
"Awaiting Admin Review",

timestamp:new Date()

});

await createEvent(

req.user.username,
"Quiz Submission",
"LOW",
"Quiz System"

);

res.json({

success:true

});

}

/* ================= QUIZ RESULTS ================= */

);

app.get(

"/quiz-results",

auth,

async (req,res)=>{

/* ADMIN GETS ALL */
if(req.user.role==="admin"){

const results =
await QuizResult.find()
.sort({timestamp:-1});

return res.json(results);

}

/* USERS GET OWN */
const results =
await QuizResult.find({

user:req.user.username

})
.sort({timestamp:-1});

res.json(results);

});

/* ================= LOGS ================= */

app.get(

"/logs",

auth,

roleCheck("admin"),

async (req,res)=>{

const logs =
await Log.find()
.sort({timestamp:-1})
.limit(100);

res.json(logs);

});

/* ================= USERS ================= */

app.get(

"/users",

auth,

roleCheck("admin"),

async (req,res)=>{

const users =
await User.find({},{

password:0

});

res.json(users);

});

/* ================= REPORT ================= */

app.get(

"/report/data",

auth,

async (req,res)=>{

const logs =
await Log.find()
.sort({timestamp:-1});

res.json(logs);

});

/* ================= SOCKET ================= */

io.on("connection", socket=>{

console.log(
"SOC Analyst Connected"
);

});

/* ================= START ================= */

server.listen(

process.env.PORT || 3000,

()=>{

console.log(
"MASTER SOC SYSTEM RUNNING"
);

});
