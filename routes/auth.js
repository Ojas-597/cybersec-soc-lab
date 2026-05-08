const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

/* VALIDATION */

if(
!username ||
!password ||
!role
){

return res.status(400).json({

error:"All fields required"

});

}

/* CHECK EXISTING USER */

const existing =
await User.findOne({
username
});

if(existing){

return res.status(400).json({

error:"User already exists"

});

}

/* HASH PASSWORD */

const hashedPassword =
await bcrypt.hash(password,10);

/* CREATE USER */

await User.create({

username,
password: hashedPassword,
role

});

/* RESPONSE */

res.json({

success:true,
message:"Account created"

});

}

catch(err){

console.log(err);

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

username

});

if(!user){

return res.status(401).json({

error:"Invalid credentials"

});

}

/* PASSWORD CHECK */

const validPassword =
await bcrypt.compare(
password,
user.password
);

if(!validPassword){

return res.status(401).json({

error:"Invalid credentials"

});

}

/* ROLE CHECK */

if(user.role !== role){

return res.status(401).json({

error:"Invalid role"

});

}

/* JWT TOKEN */

const token = jwt.sign({

id:user._id,
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
role:user.role,
username:user.username

});

}

catch(err){

console.log(err);

res.status(500).json({

error:"Login failed"

});

}

});


/* ================= CURRENT USER ================= */

router.get(

"/me",

auth,

(req,res)=>{

res.json(req.user);

});

module.exports = router;
