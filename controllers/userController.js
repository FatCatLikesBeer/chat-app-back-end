const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/users');

exports.search = asyncHandler(async (req, res, next) => {
  try {
    const userSearchQuery = new RegExp(req.params.query, 'i');
    const tokenData = req.tokenData;
    const matches = await UserModel.find({ userName: userSearchQuery }).select('userName _id').exec();
    if (matches.length === 0) {
      throw new Error("No users found");
    }
    req.response = {
      success: true,
      message: `Searching matches for ${req.params.query}`,
      data: matches,
    }
    // res.status(200).json(req.response)
    next();
  } catch (error) {
    req.error = 500;
    req.response = {
      success: false,
      message: `Get userName: Error accessing database: ${error}`,
    }
    // res.status(req.error).json(req.response)
    next();
  }
});
