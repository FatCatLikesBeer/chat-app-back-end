const apiRouter = require('express').Router();
const verifyToken = require('../middleware/jwtVerification');
const loginRouter = require('../routes/loginRouter');
const signupRouter = require('../routes/signUpRouter');
const chatRoomRouter = require('../routes/chatRoomRouter');

apiRouter.use('/login', loginRouter);
apiRouter.use('/signup', signupRouter);
apiRouter.use('/chatRoom', verifyToken, chatRoomRouter);

module.exports = apiRouter;
