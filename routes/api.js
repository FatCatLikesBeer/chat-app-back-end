const apiRouter = require('express').Router();
const verifyToken = require('../middleware/jwtVerification');
const loginRouter = require('../routes/loginRouter');
const signupRouter = require('../routes/signUpRouter');
const chatRoomRouter = require('../routes/chatRoomRouter');
const messageRouter = require('../routes/messageRouter');

apiRouter.use('/login', loginRouter);
apiRouter.use('/signup', signupRouter);
apiRouter.use('/chatRoom', verifyToken, chatRoomRouter);
apiRouter.use('/message', verifyToken, messageRouter);

module.exports = apiRouter;
