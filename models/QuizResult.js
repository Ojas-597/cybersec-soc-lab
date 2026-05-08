const mongoose = require("mongoose");

const QuizResultSchema =
new mongoose.Schema({

user:String,

score:Number,

feedback:String,

reviewedBy:String,

timestamp:{
type:Date,
default:Date.now
}

});

module.exports =
mongoose.model(
"QuizResult",
QuizResultSchema
);
