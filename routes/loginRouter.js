const loginRouter = require('express').Router();
const loginController = require('../controllers/loginController.js');

/* GET LOGIN API */
loginRouter.get('/', (req, res, next) => {
  res.status(400).json({
    success: false,
    message: "This route does not accept GET methods",
  });
});

/* POST LOGIN API */
loginRouter.post('/', loginController.login);

/* POST LOGOUT */
loginRouter.post('/logout', loginController.logout);

/* TEST */
loginRouter.post('/test', loginController.test);

module.exports = loginRouter;
