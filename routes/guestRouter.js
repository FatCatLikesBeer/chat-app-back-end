const asyncHandler = require('express-async-handler');
const guestRouter = require('express').Router();
const guestController = require('../controllers/guestController');

/* GET guest API */
guestRouter.get('/', guestController.guest)

module.exports = guestRouter;
