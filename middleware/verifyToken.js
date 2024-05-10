const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (error, tokenData) => {
    if (error) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    } else {
      req.tokenData = {
        _id: tokenData._id,
        userName: tokenData.userName,
        email: tokenData.email,
      }
      next();
    }
  });
};

module.exports = verifyToken;
