const asyncHandler = require('express-async-handler');
const express = require('express');
const loginRouter = express.Router();

/* GET LOGIN API */
loginRouter.get('/', asyncHandler(async (req, res, next) => {
  res.json({
    message: "API GET working",
    success: true,
  })
}));

module.exports = loginRouter;
