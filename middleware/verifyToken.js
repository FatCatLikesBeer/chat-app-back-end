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
      console.log('verifyToken: tokenData', tokenData);
      req.tokenData = {
        _id: tokenData._id,
        userName: tokenData.userName,
        email: tokenData.email,
      }
      console.log("verifyToken: req.tokenData", req.tokenData);
      next();
    }
  });
};

module.exports = verifyToken;
