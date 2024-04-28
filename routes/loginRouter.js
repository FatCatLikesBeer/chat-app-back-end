import asyncHandler from 'express-async-handler';
import express from 'express';
const loginRouter = express.Router();

/* GET LOGIN API */
loginRouter.get('/', asyncHandler(async (req, res, next) => {
  res.json({
    message: "API GET working",
  })
}));

export default loginRouter;
