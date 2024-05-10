const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sendPayload = asyncHandler(async (req, res, next) => {
  // Parse out response
  const response = req.response;

  // Generate token and send this stuff off!
  jwt.sign(req.tokenData, process.env.JWT_SECRET, { expiresIn: '600s'}, (err, token) => {
    if (err) {
      console.log("Error generating token");
      res.json({
        success: false,
        message: 'Error generating authentication data',
      });
    } else {
      response.token = token;
      res.json(response);
    }
  });
});

module.exports = sendPayload;
