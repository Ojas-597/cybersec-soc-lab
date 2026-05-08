const express = require("express");

const router = express.Router();

const User =
require("../models/User");

const Log =
require("../models/Log");

const {
auth,
roleCheck
} = require(
"../middleware/authMiddleware"
);

/* ================= USERS ================= */

router.get(

"/users",

auth,

roleCheck("admin"),

async (req,res)=>{

try{

const users =
await User.find({},{

password:0

});

res.json(users);

}

catch(err){

res.status(500).json({

error:"Failed to load users"

});

}

});

/* ================= ANALYTICS ================= */

router.get(

"/analytics",

auth,

roleCheck("admin"),

async (req,res)=>{

try{

const totalLogs =
await Log.countDocuments();

const critical =
await Log.countDocuments({

severity:"CRITICAL"

});

const high =
await Log.countDocuments({

severity:"HIGH"

});

res.json({

totalLogs,
critical,
high

});

}

catch(err){

res.status(500).json({

error:"Analytics failed"

});

}

});

module.exports = router;
