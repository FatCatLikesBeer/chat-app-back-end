const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (error, tokenData) => {
    if (error) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: verifyToken1",
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
