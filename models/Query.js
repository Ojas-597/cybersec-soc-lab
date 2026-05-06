const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: String,
  question: String,
  response: String,
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Query", schema);
