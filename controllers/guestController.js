const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

require('dotenv').config();

const UserModel = require('../models/users');

function generateNumbers() {
  const result = Math.floor(Math.random() * 10 ** 20);
  return result;
}

function generateUserName() {
  const result = `guest${generateNumbers()}`;
  return result;
}

exports.guest = asyncHandler(async (req, res, next) => {
  const userName = generateUserName();
  const password = btoa(generateNumbers());
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
});

