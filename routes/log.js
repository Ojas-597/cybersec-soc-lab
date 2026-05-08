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

router.get("/logs",

auth,

roleCheck("admin"),

async (req,res)=>{

try{

const logs =
await Log.find()

.sort({

timestamp:-1

})

.limit(100);

res.json(logs);

}

catch(err){

res.status(500).json({

error:"Failed to load logs"

});

}

});

module.exports = router;
