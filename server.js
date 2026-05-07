require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server);


/* =========================
   🔐 MIDDLEWARE
========================= */

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));


/* =========================
   🔑 SESSION
========================= */

app.use(session({

  secret: process.env.SESSION_SECRET,

  resave: false,

  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60
  }

}));


/* =========================
   🌐 STATIC FILES
========================= */

app.use(express.static(
  path.join(__dirname, "public")
));


/* =========================
   🗄️ DATABASE
========================= */

mongoose.connect(process.env.MONGO_URI)

.then(() => {
  console.log("✅ MongoDB Connected");
})

.catch((err) => {
  console.error("❌ MongoDB Error:");
  console.error(err);
});


/* =========================
   📡 SOCKET.IO
========================= */

io.on("connection", (socket) => {

  console.log("🟢 User connected");

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });

});

app.set("io", io);


/* =========================
   📦 ROUTES
========================= */

const authRoutes = require("./routes/auth");
const queryRoutes = require("./routes/query");
const logRoutes = require("./routes/log");

app.use("/", authRoutes);
app.use("/", queryRoutes);
app.use("/", logRoutes);


/* =========================
   🧪 HEALTH CHECK
========================= */

app.get("/test", (req, res) => {

  res.json({
    success: true,
    message: "🚀 SOC Lab Server Running"
  });

});


/* =========================
   ❌ 404
========================= */

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "Route not found"
  });

});


/* =========================
   ⚠️ ERROR HANDLER
========================= */

app.use((err, req, res, next) => {

  console.error("❌ SERVER ERROR:");
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });

});


/* =========================
   🚀 START SERVER
========================= */

const PORT = 5000;

server.listen(PORT, () => {

  console.log(
    `🔥 Server running at http://localhost:${PORT}`
  );

});
