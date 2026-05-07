const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({

  message: {
    type: String,
    required: true
  },

  level: {
    type: String,
    default: "INFO"
  },

  time: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Log", logSchema);
