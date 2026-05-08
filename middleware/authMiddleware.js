const jwt = require("jsonwebtoken");

/* ================= AUTH ================= */

function auth(req, res, next) {

  const header =
  req.headers.authorization;

  /* NO HEADER */
  if (!header) {

    return res.status(401).json({

      error: "No token provided"

    });

  }

  try {

    /* GET TOKEN */
    const token =
    header.split(" ")[1];

    /* VERIFY */
    const decoded =
    jwt.verify(

      token,

      process.env.JWT_SECRET

    );

    /* SAVE USER */
    req.user = decoded;

    next();

  }

  catch (err) {

    return res.status(401).json({

      error: "Invalid token"

    });

  }

}

/* ================= ROLE CHECK ================= */

function roleCheck(...roles) {

  return (req, res, next) => {

    /* ACCESS CHECK */
    if (

      !roles.includes(
        req.user.role
      )

    ) {

      return res.status(403).json({

        error: "Access denied"

      });

    }

    next();

  };

}

module.exports = {

  auth,
  roleCheck

};
