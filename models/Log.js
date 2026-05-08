const mongoose = require("mongoose");

const LogSchema =
new mongoose.Schema({

user:String,

type:String,

severity:String,

source:String,

description:String,

timestamp:{
type:Date,
default:Date.now
}

});

module.exports =
mongoose.model(
"Log",
LogSchema
);
