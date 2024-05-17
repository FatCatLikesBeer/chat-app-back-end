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
const MessageModel = require('../models/messages');

/* GET message detail */
exports.messageDetail = asyncHandler(async (req, res, next) => {
  req.response = {
    success: true,
    message: "Message Detail not yet implmented",
  }
  next();
});

/* GET messages */
exports.messageList = asyncHandler(async (req, res, next) => {
  try {
    const chatRoom = req.body.chatRoom;
    const listOfMessages = await MessageModel.find({ chatRoom: chatRoom }).sort({ dateCreated: -1 }).exec();
    req.response = {
      message: 'List of messages successfully retrieved',
      data: listOfMessages,
    }
  } catch (error) {
    req.error = 500;
    req.response = {
      message: `Sorry but something broke, \nerrorStatement: messageControllerGET\n${error}`,
    };
  }
  next();
});

/* POST message */
exports.messageCreate = asyncHandler(async (req, res, next) => {
  try {
    const chatRoom = req.body.chatRoom;
    const message = req.body.message;
    const newMessage = new MessageModel({
      author: {
        _id: req.tokenData._id,
        userName: req.tokenData.userName,
      },
      chatRoom: chatRoom,
      message: message,
    })
    await newMessage.save();
    const listOfMessages = await MessageModel.find({ chatRoom: chatRoom }).sort({ dateCreated: -1 }).exec();
    req.response = {
      success: true,
      message: 'Message successfully posted',
      data: listOfMessages,
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Sorry but something broke, \nerrorStatement: messageControllerPOST\n${error}`,
    });
  }
});

/* PUT message edit */
exports.messageEdit = asyncHandler(async (req, res, next) => {
  try {
    const message = req.body.message;
    const prevMessage = {
      message: message.message,
      dateCreated: message.dateCreated,
    }
    const newMessage = new MessageModel({
      message: req.body.edit,
      author: message.author,
      chatRoom: message.chatRoom,
      prevMessages: prevMessage,
      _id: message._id,
    })
    const updatedMessage = await MessageModel.findByIdAndUpdate(message._id, newMessage, {});
    const listOfMessages = await MessageModel.find({ chatRoom: message.chatRoom }).sort({ dateCreated: -1 }).exec();
    req.response = {
      success: true,
      message: "Message was successfully edited",
      data: listOfMessages,
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Sorry but something broke, \nerrorStatement: messageControllerPUT\n${error}`,
    });
  }
});

/* DELETE message */
exports.messageDelete = asyncHandler(async (req, res, next) => {
  try {
    await MessageModel.updateOne({ _id: req.body.message._id }, { $set: { visible: false } });
    req.response = { success: true, message: "Message successfully deleted" }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Sorry but something broke, \nerrorStatement: messageControllerDELETE\n${error}`,
    });
  }
});
