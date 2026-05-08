const express = require("express");

const router = express.Router();

const Log =
require("../models/Log");

const {
auth,
roleCheck
} = require(
"../middleware/authMiddleware"
);

/* ================= GET LOGS ================= */

app.get(

"/logs",

auth,

roleCheck("admin","analyst"),

async(req,res)=>{

try{

const logs = await Log.find()

.sort({createdAt:-1})

.limit(100);

res.json(logs);

}

catch(err){

console.error(err);

res.status(500).json({

error:"Failed to fetch logs"

});

}

});

module.exports = router;
