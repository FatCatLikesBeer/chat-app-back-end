const apiRouter = require('express').Router();

const tokenMover = require('../middleware/tokenMover');
const verifyToken = require('../middleware/verifyToken');
const sendPayload = require('../middleware/sendPayload')

const loginRouter = require('../routes/loginRouter');
const signupRouter = require('../routes/signUpRouter');
const chatRoomRouter = require('../routes/chatRoomRouter');
const messageRouter = require('../routes/messageRouter');


apiRouter.use('/signup', signupRouter);
apiRouter.use('/login', loginRouter);
apiRouter.use('/chatRoom', tokenMover, chatRoomRouter);
apiRouter.use('/message', tokenMover, messageRouter);

// This stuff is here for testing new things
const testThingy = require('../routes/testLogic');
apiRouter.use('/test', tokenMover, verifyToken, testThingy,sendPayload);

module.exports = apiRouter;
