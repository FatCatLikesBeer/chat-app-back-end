const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const passportLocal = require('passport-local');

require('dotenv').config();

const UserModel = require('../models/users');
const ChatRoomModel = require('../models/chatrooms');

/* Get ChatRooms */
exports.chatRoomList = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    message: 'ChatRoom List not yet implemented',
  });
});

/* Get ChatRoom Detail */
exports.chatRoomDetail = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    message: 'ChatRoom Detail not yet implemented',
  });
});

/* Create ChatRoom */
exports.chatRoomCreate = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    message: 'ChatRoom Create not yet implemented',
  });
});

/* Edit ChatRoom */
exports.chatRoomEdit = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    message: 'ChatRoom Edit not yet implemented',
  });
});

/* Delete ChatRoom */
/* I'm not exactly sure what this is going
   to return but it's here just incase */
exports.chatRoomDelete = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    message: 'ChatRoom Delete not yet implemented',
  });
});

