const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/User");

const { auth } =
require("../middleware/authMiddleware");

/* ================= SIGNUP ================= */

router.post("/signup", async (req,res)=>{

try{

const {
username,
password,
role
} = req.body;

/* CHECK EXISTING */
const existing =
await User.findOne({
username
});

if(existing){

return res.status(400).json({

error:"User already exists"

});

}

/* CREATE USER */
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

router.post("/login", async (req,res)=>{

try{

const {
username,
password,
role
} = req.body;

/* FIND USER */
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

/* RESPONSE */
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

router.get("/me",

auth,

(req,res)=>{

res.json(req.user);

});

module.exports = router;
