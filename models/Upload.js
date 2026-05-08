const mongoose = require("mongoose");

const UploadSchema =
new mongoose.Schema({

user:String,

filename:String,

description:String,

timestamp:{
type:Date,
default:Date.now
}

});

module.exports =
mongoose.model(
"Upload",
UploadSchema
);
