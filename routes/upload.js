const express = require("express");

const multer = require("multer");

const router = express.Router();

const Upload =
require("../models/Upload");

const Log =
require("../models/Log");

const { auth } =
require("../middleware/authMiddleware");

/* ================= STORAGE ================= */

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

/* ================= EVENT ================= */

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

/* ================= UPLOAD ================= */

router.post(

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

/* LOG EVENT */
await createEvent(

req.user.username,
"Evidence Upload",
"MEDIUM",
"Upload System",
req.body.description

);

res.json({

success:true,

filename:req.file.filename

});

}

catch(err){

res.status(500).json({

error:"Upload failed"

});

}

}

);

module.exports = router;
