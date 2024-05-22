const asyncHandler = require('express-async-handler');
const signUpRouter = require('express').Router();
const signUpController = require('../controllers/signUpController');

/* GET SIGNUP API */
signUpRouter.get('/', (req, res, next) => {
  res.status(400).json({
    success: false,
    message: "This route does not accept GET methods",
  });
});

/* POST SIGNUP API */
signUpRouter.post('/', signUpController.signUp)

module.exports = signUpRouter;
