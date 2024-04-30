const express = require('express');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const bcrypt = require("bcryptjs");

require('dotenv').config();
const LocalStrategy = require("passport-local").Strategy;
const { createServer } = require('node:http');

const loginRouter = require('./routes/loginRouter');
const signUpRouter = require('./routes/signUpRouter');

const app = express();
const server = createServer(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//// ------ Passport Stuff ------ ////
// Passport.js local login 'strategy'
passport.use(
  new LocalStrategy(async (userName, password, done) => {
    try {
      const user = await User.findOne({ userName: username });
      const match = await bcrypt.compare(password, user.password);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      };
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);
// The method below creates a user cookie which
// allows them to stay logged in.
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// The method below checks the cookie.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});


app.get('/', asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    message: "Welcome to our Chat App API!",
  });
}));

app.use('/signup', signUpRouter);
app.use('/login', loginRouter);

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "SOMETHING WENT TERRIBLY WRONG 😫"
  });
});

server.listen(3000, () => {
  console.log("Server running at https://localhost:3000");
});
