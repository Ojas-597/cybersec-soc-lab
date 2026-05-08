const mongoose = require("mongoose");

const QuerySchema =
new mongoose.Schema({

user:String,

question:String,

response:Array,

timestamp:{
type:Date,
default:Date.now
}

});

module.exports =
mongoose.model(
"Query",
QuerySchema
);
