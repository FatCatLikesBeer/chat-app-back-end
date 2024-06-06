const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

require('dotenv').config();

const UserModel = require('../models/users');

exports.signUp = [
  body('userName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username character minimum: 3'),

  body('userName')
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username character maximum: 20'),

  body('userName')
    .trim()
    .notEmpty()
    .withMessage('Username must not be empty'),

  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password character minimum: 8'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid Email'),

  // Making My own custom error validation 😃
  // Check if username already exists
  body('userName')
    .trim()
    .custom(async value => {
      const existingUser = await UserModel.findOne({ userName: value }).exec();
      if (existingUser) {
        throw new Error('Signup failed. Please check your details and try again.');
      }
    }),

  // Check if email aready in use
  body('email')
    .trim()
    .custom(async value => {
      const existingUser = await UserModel.findOne({ email: value }).exec();
      if (existingUser) {
        throw new Error('Signup failed. Please check your details and try again.');
      }
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [userName, email, password] = [
      req.body.userName,
      req.body.email,
      req.body.password,
    ];

    // Errors From Body Parser
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
    } else {
      // No errors in request body
      try {
        bcrypt.hash(password, 12, async (error, hashedPassword) => {
          // Create a new user
          const newUser = new UserModel({
            userName: userName,
            password: hashedPassword,
            email: email,
          });

          // Save user
          await newUser.save();

          // Make a JWT
          const payload = {
            _id: newUser._id.toString(),
            userName: userName,
            email: email,
          }

          jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '600s' }, (err, token) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: "Error generating token",
              })
            } else {
              // Send data back to client
              res.cookie('Barer', token);
              res.json({
                success: true,
                message: "Signup Successful 😃",
                userData: {
                  userName: payload.userName,
                  email: payload.email,
                  _id: payload._id,
                },
              });
            }
          });
        });
      } catch (err) {
        res.status(400).json({
          success: false,
          message: 'Error signing up',
        });
      }
    }
  })
]
