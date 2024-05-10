const testRouter = require('express').Router();
const asyncHandler = require('express-async-handler');

testRouter.get('/', asyncHandler(async (req, res, next) => {
  // Create response object
  req.response = {
    success: true,
    message: 'This test is working 👍',
    data: [1, 2, 3, 4, 5],
  }

  // Hand off to next middleware
  next();
}));

module.exports = testRouter;
