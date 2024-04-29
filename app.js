const express = require('express');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { createServer } = require('node:http');

const loginRouter = require('./routes/loginRouter.js');

const app = express();
const server = createServer(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    message: "Welcome to our Chat App API!",
  });
}));

app.use('/login', loginRouter);

server.listen(3000, () => {
  console.log("Server running at https://localhost:3000");
});
