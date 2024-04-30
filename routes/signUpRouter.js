const express = require('express');
const signUpController = require('../controllers/signUpController');
const signUpRouter = express.Router();

signUpRouter.post('/', signUpController.signUp)

module.exports = signUpRouter;
