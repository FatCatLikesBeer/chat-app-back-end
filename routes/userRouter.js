const userRouter = require('express').Router();
const userController = require('../controllers/userController');

/* GET/Search for user(s) */
userRouter.get('/:query', userController.search);

/* PUT edits to user */

/* DELETE User */

module.exports = userRouter;
