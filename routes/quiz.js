const express = require("express");

const router = express.Router();

const QuizResult =
require("../models/QuizResult");

const {
auth,
roleCheck
} = require(
"../middleware/authMiddleware"
);

/* ================= SUBMIT QUIZ ================= */

router.post(

"/quiz/submit",

auth,

async (req,res)=>{

try{

const { score } =
req.body;

await QuizResult.create({

user:req.user.username,

score,

feedback:
"Pending Admin Review",

reviewedBy:
"Pending",

timestamp:new Date()

});

res.json({

success:true

});

}

catch(err){

res.status(500).json({

error:"Quiz submission failed"

});

}

}

/* ================= GET RESULTS ================= */

);

router.get(

"/quiz-results",

auth,

async (req,res)=>{

try{

/* ADMIN GETS ALL */
if(req.user.role==="admin"){

const results =
await QuizResult.find()

.sort({

timestamp:-1

});

return res.json(results);

}

/* USER GETS OWN */
const results =
await QuizResult.find({

user:req.user.username

});

res.json(results);

}

catch(err){

res.status(500).json({

error:"Failed to load results"

});

}

});

/* ================= REVIEW ================= */

router.post(

"/quiz/review/:id",

auth,

roleCheck("admin"),

async (req,res)=>{

try{

await QuizResult.findByIdAndUpdate(

req.params.id,

{

feedback:req.body.feedback,

reviewedBy:req.user.username

}

);

res.json({

success:true

});

}

catch(err){

res.status(500).json({

error:"Review failed"

});

}

});

module.exports = router;
