const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sendPayload = asyncHandler(async (req, res, next) => {
  // Parse out payload
  const payload = req.tokenData;

  // Parse out response
  const response = req.response;

  // Error flag
  const errorFlag = req.error || 'undefined';

  // Generate token and send this stuff off!
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10 days' }, (err, token) => {
    if (err) {
      console.error("Error generating token", err);
      res.json({
        success: false,
        message: 'Error generating authentication data',
      });
    } else {
      response.userName = req.tokenData.userName;
      response.token = token;
      if (errorFlag != 'undefined') {
        response.success = false;
        res.status(errorFlag).json(response);
      } else {
        response.success = true;
        res.json(response);
      }
    }
  });
});

module.exports = sendPayload;
