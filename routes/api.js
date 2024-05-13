const apiRouter = require('express').Router();

const tokenMover = require('../middleware/tokenMover');
const verifyToken = require('../middleware/verifyToken');
const payloadToJWT = require('../middleware/payloadToJWT');

const loginRouter = require('../routes/loginRouter');
const signupRouter = require('../routes/signUpRouter');
const chatRoomRouter = require('../routes/chatRoomRouter');
const messageRouter = require('../routes/messageRouter');

apiRouter.use('/signup', signupRouter);
apiRouter.use('/login', loginRouter);
apiRouter.use('/chatRoom', tokenMover, verifyToken, chatRoomRouter, payloadToJWT);
apiRouter.use('/message', tokenMover, verifyToken, messageRouter, payloadToJWT);

// This stuff is here for testing new things
const testingRoute = require('../routes/testLogic');
apiRouter.use('/test', tokenMover, verifyToken, testingRoute, payloadToJWT);

module.exports = apiRouter;
