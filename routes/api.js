const apiRouter = require('express').Router();
const loginRouter = require('../routes/loginRouter');
const signupRouter = require('../routes/signUpRouter');
const chatRoomRouter = require('../routes/chatRoomRouter');

apiRouter.use('/login', loginRouter);
apiRouter.use('/signup', signupRouter);
apiRouter.use('/chatRoom', chatRoomRouter);

module.exports = apiRouter;
