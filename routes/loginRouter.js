const express = require('express');
const asyncHandler = require('express-async-handler');
const loginRouter = express.Router();
const loginController = require('../controllers/loginController.js');

/* GET LOGIN API */
loginRouter.post('/', loginController.login);

/* GET LOGOUT */
loginRouter.post('/logout', loginController.logout)

module.exports = loginRouter;
