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
  jwt.verify(req.token, process.env.JWT_SECRET, async (error, tokenData) => {
    if (error) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    } else {
      // Query DB for message detail
      // Return message details in response
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
            message: 'GET message Detail not yet implemented',
            token: token,
          });
        }
      });
    }
  });
});

/* GET message */
exports.messageList = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (error, tokenData) => {
    if (error) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    } else {
      // Query DB for list of 50 most recent messages per chatoom
      // Return query in response
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
            message: 'GET message list not yet implemented',
            token: token,
          });
        }
      });
    }
  });
});

/* POST message */
exports.messageCreate = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (error, tokenData) => {
    if (error) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    } else {
      // Parse body of message value
      // Add it to database
      // Return the value in response
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
            message: 'POST message Detail not yet implemented',
            token: token,
          });
        }
      });
    }
  });
});

/* PUT message edit */
exports.messageEdit = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (error, tokenData) => {
    if (error) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    } else {
      // I don't think I'll use this...
      // I added a prevMessages array to the model just incase
      // message.prevMessages.push({
      //  message: message.message,
      //  dateCreated: message.dateCreated,
      // });
      // message.message = "";
      // message.dateCreated = new Date.now();
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
            message: 'PUT message not yet implemented',
            token: token,
          });
        }
      });
    }
  });
});

/* DELETE message */
exports.messageDelete = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (error, tokenData) => {
    if (error) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    } else {
      // just change message.visible to false
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
            message: 'DELETE message not yet implmented',
            token: token,
          });
        }
      });
    }
  });
});

