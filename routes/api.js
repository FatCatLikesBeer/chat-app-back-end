const router = require('express').Router();
const loginRouter = require('../routes/loginRouter');
const signupRouter = require('../routes/signUpRouter');

router.use('/login', loginRouter);
router.use('/signup', signupRouter);

module.exports = router;
