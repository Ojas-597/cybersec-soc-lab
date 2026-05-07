const mongoose = require("mongoose");


const querySchema = new mongoose.Schema({

  user: {

    type: String,

    required: true

  },


  question: {

    type: String,

    required: true

  },


  response: {

    type: String,

    required: true

  },


  time: {

    type: Date,

    default: Date.now

  }

});


module.exports =
  mongoose.model(
    "Query",
    querySchema
  );
