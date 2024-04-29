const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

exports.get = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    message: "API LOGIN GET working",
  })
});
