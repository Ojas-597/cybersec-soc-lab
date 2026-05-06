// middleware/auth.js

module.exports = {

  // 🔐 Check login
  isAuth: (req, res, next) => {
    if (!req.session.user) {
      return res.send("❌ Please login first");
    }
    next();
  },

  // 👑 Admin only
  isAdmin: (req, res, next) => {
    if (req.session.user?.role !== "admin") {
      return res.send("❌ Admin access only");
    }
    next();
  },

  // 🧪 Analyst + Admin
  isAnalyst: (req, res, next) => {
    if (!["admin", "analyst"].includes(req.session.user?.role)) {
      return res.send("❌ Analyst access only");
    }
    next();
  }

};
