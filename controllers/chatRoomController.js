const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const passportLocal = require('passport-local');
const verifyToken = require('../middleware/jwtVerification');

require('dotenv').config();

const UserModel = require('../models/users');
const ChatRoomModel = require('../models/chatrooms');

/*
PUT Body:
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
  jwt.verify(req.token, process.env.JWT_SECRET, async (error, tokenData) => {
    if (error) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    } else {
      // Get chatRoom list
      const chatRooms = await ChatRoomModel.find({ owner: tokenData._id }).exec();
      // Create new JWT
      const payload = {
        _id: tokenData.id,
        name: tokenData.name,
        email: tokenData.email,
      };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '600s'}, (err, token) => {
        if (err) {
          console.log("Error generating token");
          res.json({
            success: false,
            message: 'Error generating authentication data',
          });
        } else {
          // Create JSON response
          res.json({
            success: true,
            message: `List of chatRooms for ${tokenData.userName}`,
            token: token,
            data: chatRooms,
          });
        }
      });
    }
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
  jwt.verify(req.token, process.env.JWT_SECRET, async (error, tokenData) => {
    if (error) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    } else {
      // Create chatRoom
      const user = await UserModel.findById(tokenData._id).exec();
      const newChatRoom = new ChatRoomModel({
        owner: user._id,
      });
      await newChatRoom.save();
      const chatRooms = await ChatRoomModel.find({ owner: tokenData._id }).exec();
      // Create new JWT
      const payload = {
        _id: tokenData.id,
        name: tokenData.name,
        email: tokenData.email,
      };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '600s'}, (err, token) => {
        if (err) {
          console.log("Error generating token");
          res.json({
            success: false,
            message: 'Error generating authentication data',
          });
        } else {
          // Create JSON response
          res.json({
            success: true,
            message: `${tokenData.userName} created a new chatRoom`,
            token: token,
            data: chatRooms,
          });
        }
      });
    }
  });
});

/* Edit ChatRoom */
exports.chatRoomEdit = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (error, tokenData) => {
    if (error) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    } else {
      const chatRoom = await ChatRoomModel.findById(req.body.chatRoom).exec();
      // Modify Participants
      if (req.body.add) {
        chatRoom.participants = [...req.body.add];
      }
      if (req.body.remove) {
        req.body.remove.forEach(elem => {
          delete chatRoom.participants[chatRoom.participants.indexOf(elem)];
          chatRoom.participants.sort();
          chatRoom.participants.pop();
        });
      }
      // Change Owners
      chatRoom.owner = req.body.chown || chatRoom.owner;
      // Create new JWT
      await chatRoom.save();
      const chatRooms = await ChatRoomModel.find({ owner: tokenData._id }).exec();
      const payload = {
        _id: tokenData.id,
        name: tokenData.name,
        email: tokenData.email,
      };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '600s'}, (err, token) => {
        if (err) {
          console.log("Error generating token");
          res.json({
            success: false,
            message: 'Error generating authentication data',
          });
        } else {
          // Create JSON response
          res.json({
            success: true,
            message: `${tokenData.userName} edited a chatRoom`,
            token: token,
            data: chatRooms,
          });
        }
      });
    }
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


