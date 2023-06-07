const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, "masai");

      if (decoded) {
        req.body.userID = decoded.userID;
        req.body.user = decoded.user;
        next();
      } else {
        res.json({ msg: "Not Authorized!!!" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.json({ msg: "Please login!!" });
  }
}

module.exports = { auth };
