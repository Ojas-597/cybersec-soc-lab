const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({

user:String,

action:String,

severity:String

},

{

timestamps:true

});

module.exports =
mongoose.model(
"Log",
logSchema
);
