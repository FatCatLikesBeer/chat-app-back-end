const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const passportLocal = require('passport-local');

require('dotenv').config();

const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/users');
const ChatRoomModel = require('../models/chatrooms');
const getChats = require('../controllers/chatRoomController');

// This is here to test creating a custom body-parser function
exports.test = [
  // User Not Found
  body('userName')
    .trim()
    .custom(async value => {
      const existingUser = await UserModel.findOne({ userName: value }).exec();
      if (!existingUser) {
        throw new Error('Username or password is incorrect');
      }
    }),
  asyncHandler(async (req, res, next) => {
    res.json({
      success: true,
      message: "Working",
    });
  }),
]

exports.login = [
  body('userName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username or password is incorrect'),

  body('userName')
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username or password is incorrect'),

  body('userName')
    .trim()
    .notEmpty()
    .withMessage('Username must not be empty'),

  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Username or password is incorrect'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password must not be empty'),

  // User Not Found
  body('userName')
    .trim()
    .custom(async value => {
      const existingUser = await UserModel.findOne({ userName: value }).exec();
      if (!existingUser) {
        throw new Error('Username or password is incorrect');
      }
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [userName, password] = [req.body.userName, req.body.password];

    if (!errors.isEmpty()) {
      // If errors exist
      const errorMessage = errors.array()[0].msg;
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
    } else {
      const queryUser = await UserModel.findOne({ userName: userName }).exec();
      if (queryUser) {
        try {
          const match = await bcrypt.compare(password, queryUser.password);
          if (match) {
            // Get chatRooms for user
            req.skipNext = true;
            req.tokenData = {
              _id: queryUser._id
            }
            const chatRooms = await getChats.chatRoomList(req, res, next);
            // If user found & password matches send token
            const payload = {
              _id: queryUser._id,
              userName: userName,
              email: queryUser.email,
            };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '600s' }, (err, token) => {
              // If error generating token
              if (err) {
                res.status(400).json({
                  success: false,
                  message: "Error generating token",
                })
              } else {
                // Send data back to client
                res.cookie("Barer", token);
                res.json({
                  success: true,
                  message: 'Login Successful 😃',
                  chatRooms: chatRooms,
                  userData: {
                    userName: userName,
                    email: queryUser.email,
                    _id: queryUser._id,
                  },
                });
              }
            });
          } else {
            // If user found but password doesn't match
            res.status(400).json({
              success: false,
              message: 'Username or password is incorrect',
            })
          }
        } catch (error) {
          console.error(error);
          res.json({
            success: false,
            error: error
          });
        }
      }
    };
  }),
]

exports.logout = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    message: 'API LOGOUT GET working',
  });
});
