module.exports = {

  /* =========================
     🔐 CHECK LOGIN
  ========================= */

  isAuth: (req, res, next) => {

    if (!req.session.user) {

      return res.status(401).json({

        success: false,

        message: "❌ Please login first"

      });

    }

    next();

  },


  /* =========================
     👑 ADMIN ONLY
  ========================= */

  isAdmin: (req, res, next) => {

    if (
      !req.session.user ||
      req.session.user.role !== "admin"
    ) {

      return res.status(403).json({

        success: false,

        message: "❌ Admin access only"

      });

    }

    next();

  },


  /* =========================
     🧪 ANALYST + ADMIN
  ========================= */

  isAnalyst: (req, res, next) => {

    if (

      !req.session.user ||

      !["admin", "analyst"]
      .includes(req.session.user.role)

    ) {

      return res.status(403).json({

        success: false,

        message: "❌ Analyst access only"

      });

    }

    next();

  }

};
