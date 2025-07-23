const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const checkForAuthentication = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Login First" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // console.log("users is ", user);
    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
};

module.exports = {
  checkForAuthentication,
};
