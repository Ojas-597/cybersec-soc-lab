const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/cyberwiki");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true
}));

app.use(express.static("public"));

// routes
app.use(require("./routes/auth"));
app.use(require("./routes/query"));
app.use(require("./routes/log"));

app.listen(3000, () => console.log("Server running on 3000"));
