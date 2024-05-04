const asyncHandler = require('express-async-handler');
const loginRouter = require('express').Router();
const loginController = require('../controllers/loginController.js');

/* GET LOGIN API */
loginRouter.post('/', loginController.login);

/* GET LOGOUT */
loginRouter.post('/logout', loginController.logout);

/* GET TEST */
loginRouter.post('/test', loginController.test);

module.exports = loginRouter;
