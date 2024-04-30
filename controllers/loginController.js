const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportLocal = require('passport-local');

exports.login = asyncHandler(async (req, res, next) => {
  // Response Object
  res.json({
    success: true,
    message: 'API LOGIN GET working',
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    message: 'API LOTOUT GET working',
  });
});
