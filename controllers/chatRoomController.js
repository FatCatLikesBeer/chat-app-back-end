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

/*
Expected structure of
a PUT body request
{
  chatRoom: ChatRoom._id,
  chown: User._id,
  add: [
    User1._id,
    User2._id
  ],
  remove: [
    User1._id,
    User2._id
  ],
}
*/

/* Get ChatRooms */
exports.chatRoomList = asyncHandler(async (req, res, next) => {
  try {
    const tokenData = req.tokenData;
    const chatRooms = await ChatRoomModel.find({ owner: tokenData._id }).exec();
    req.response = {
      success: true,
      message: `List of chatRooms for ${tokenData.userName}`,
      data: chatRooms,
    }
    if (req.skipNext === true) {
      return chatRooms;
    } else {
      next();
    }
  } catch (error) {
    req.error = 500;
    req.response = {
      success: false,
      message: `Get chatRoomList: Error accessing database: ${error}`,
    }
    next();
  }
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
  try {
    const tokenData = req.tokenData;
    // Create chatRoom
    const user = await UserModel.findById(tokenData._id).exec();
    const newChatRoom = new ChatRoomModel({
      owner: user._id,
    });
    await newChatRoom.save();
    const chatRooms = await ChatRoomModel.find({ owner: tokenData._id }).exec();
    req.response = {
      success: true,
      message: `${tokenData.userName} created a new chatRoom`,
      data: chatRooms,
    }
    next();
  } catch (error) {
    req.error = 500;
    req.response = {
      success: false,
      message: `Create chatRoom: Error accessing database: ${error}`,
    }
    next();
  }
});

/* PUT chatRoom edits */
exports.chatRoomEdit = asyncHandler(async (req, res, next) => {
  try {
   const tokenData = req.tokenData;
  const chatRoom = await ChatRoomModel.findById(req.body.chatRoom).exec();

  // Modify Participants
  if (req.body.add) {
    // For each element in the add array, only add
    // element if not already in participants array
    req.body.add.forEach(elem => {
      if (!chatRoom.participants.includes(elem)) {
        chatRoom.participants.push(elem);
      }
    });
  }
  // Remove participants
  // This block of garbage exists because javascript...
  // Find index of element, delete value at element, move
  // empty element to the end, pop the end of array...
  if (req.body.remove) {
    req.body.remove.forEach(elem => {
      delete chatRoom.participants[chatRoom.participants.indexOf(elem)];
      chatRoom.participants.sort();
      chatRoom.participants.pop();
    });
  }

  // Change Owners
  chatRoom.owner = req.body.chown || chatRoom.owner;

  // Save modified chatRoom
  await chatRoom.save();

  // Get updated list of chatRooms for user
  const chatRooms = await ChatRoomModel.find({ owner: tokenData._id }).exec();

  // Save the JSON API response
  req.response = {
    success: true,
    message: `${tokenData.userName} edited a chatRoom`,
    data: chatRooms,
  }
  next();
  } catch (error) {
    req.error = 500;
    req.response = {
      success: false,
      message: `Edit chatRoom: Error accessing database: ${error}`,
    }
    next();
  }
});

/* Delete ChatRoom */
/* I'm not exactly sure what this is going
   to return but it's here just incase */
exports.chatRoomDelete = asyncHandler(async (req, res, next) => {
  try {
   const tokenData = req.tokenData;

  const deleteThisRoom = req.body.chatRoom;
  await ChatRoomModel.findByIdAndDelete(deleteThisRoom).exec();
  const chatRooms = await ChatRoomModel.find({ owner: tokenData._id }).exec();

  // Save the JSON API response
  req.response = {
    success: true,
    message: 'chatRoom successfully deleted',
    data: chatRooms,
  }
  next();
  } catch (error) {
    req.error = 500;
    req.response = {
      success: false,
      message: `Delete chatRoom: Error accessing database: ${error}`,
    }
    next();
  }
});


