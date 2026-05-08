const express = require("express");

const router = express.Router();

const Log =
require("../models/Log");

const { auth } =
require("../middleware/authMiddleware");

/* ================= REPORT ================= */

router.get(

"/report/data",

auth,

async (req,res)=>{

try{

const logs =
await Log.find()

.sort({

timestamp:-1

});

res.json(logs);

}

catch(err){

res.status(500).json({

error:"Failed to load reports"

});

}

});

module.exports = router;
