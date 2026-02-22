const jwt = require("jsonwebtoken");
const User = require("../models/User"); //  ADD (new)

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Token missing
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Token extract
    const token = authHeader.split(" ")[1];

    // Token verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User id attach (OLD – untouched)
    req.userId = decoded.userId;

    //  NEW: FULL USER FETCH (password ke bina)
    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// VERY IMPORTANT (DEFAULT EXPORT)
module.exports = protect;
