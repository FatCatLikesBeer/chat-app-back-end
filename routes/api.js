const apiRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const path = require('path');

const tokenMover = require('../middleware/tokenMover');
const verifyToken = require('../middleware/verifyToken');
const payloadToJWT = require('../middleware/payloadToJWT');

const loginRouter = require('../routes/loginRouter');
const signupRouter = require('../routes/signUpRouter');
const chatRoomRouter = require('../routes/chatRoomRouter');
const messageRouter = require('../routes/messageRouter');
const userRouter = require('../routes/userRouter');

apiRouter.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'api.html')); });
apiRouter.use('/signup', signupRouter);
apiRouter.use('/login', loginRouter);
apiRouter.use('/chatRoom', tokenMover, verifyToken, chatRoomRouter, payloadToJWT);
apiRouter.use('/message', tokenMover, verifyToken, messageRouter, payloadToJWT);
apiRouter.use('/user', tokenMover, verifyToken, userRouter, payloadToJWT);
apiRouter.get('/logout', (req, res, next) => {
  res.cookie("Barer", undefined).status(200).json({
    success: true,
    message: "Logging Out"
  });
});

// This stuff is here for testing new things
const testingRoute = require('../routes/testLogic');
apiRouter.use('/test', tokenMover, verifyToken, testingRoute, payloadToJWT);

module.exports = apiRouter;
