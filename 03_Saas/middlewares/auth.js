const jwt = require("jsonwebtoken");

const checkforAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    console.log("token is ", token);
    if (!token) {
      return res.send("Unauthorized Access");
    }

    const decoded = jwt.decode(token);

    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.send("checkForAuthFailed", error);
  }
};

module.exports = checkforAuth;
