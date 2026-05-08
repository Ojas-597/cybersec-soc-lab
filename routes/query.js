const express = require("express");

const router = express.Router();

const Query =
require("../models/Query");

const Log =
require("../models/Log");

const { auth } =
require("../middleware/authMiddleware");

const attacks =
require("../data/attacks");

/* ================= CREATE EVENT ================= */

async function createEvent(

user,
type,
severity,
source,
description

){

await Log.create({

user,
type,
severity,
source,
description,

timestamp:new Date()

});

}

/* ================= AI QUERY ================= */

router.post("/ask",

auth,

async (req,res)=>{

try{

const q =
req.body.question.toLowerCase();

let results = [];

/* ATTACK MATCH */
const matches =
attacks.filter(a=>
q.includes(a.keyword)
);

/* UNKNOWN */
if(matches.length===0){

matches.push({

attack:"Unknown Threat",

severity:"LOW",

tool:"Manual Investigation",

solution:
"Further investigation required",

confidence:"70%"

});

}

/* SAVE RESULTS */
for(const a of matches){

results.push(a);

/* LOG */
await createEvent(

req.user.username,
a.attack,
a.severity,
"AI Threat Engine",
q

);

}

/* SAVE QUERY */
await Query.create({

user:req.user.username,

question:q,

response:results,

timestamp:new Date()

});

res.json(results);

}

catch(err){

res.status(500).json({

error:"Threat analysis failed"

});

}

});

module.exports = router;
