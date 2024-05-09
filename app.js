const express = require('express');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const bcrypt = require("bcryptjs");
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

require('dotenv').config();
const LocalStrategy = require("passport-local").Strategy;
const { createServer } = require('node:http');

const loginRouter = require('./routes/loginRouter');
const signUpRouter = require('./routes/signUpRouter');
const apiRouter = require('./routes/api');

const app = express();
const server = createServer(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'build')));
// Is this production or development?
const serverState = process.env.DEV || "prod";
//// ------ MongoDB Stuff ------ ////
if (serverState === "dev") {
  // This is required only to prevent 10,000 ms response times via cURL testing
  require("./servers/development");
}

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'tips.html'));
});

app.use('/apiv1', apiRouter);

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "SOMETHING WENT TERRIBLY WRONG 😫"
  });
});

server.listen(3000, () => {
  console.log("Server running at https://localhost:3000");
});
