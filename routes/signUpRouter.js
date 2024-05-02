const asyncHandler = require('express-async-handler');
const signUpRouter = require('express').Router();
const signUpController = require('../controllers/signUpController');

signUpRouter.post('/', signUpController.signUp)

module.exports = signUpRouter;
