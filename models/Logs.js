const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  message: String,
  level: String,
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", schema);
