const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.search = asyncHandler(async (req, res, next) => {
  req.response = {
    message: 'boobies',
  }
  next();
});
