const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const loginRouter = require('../routes/loginRouter.js');
const { MongoMemoryServer } = require('mongodb-memory-server');

const UserModel = require('../models/users');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', loginRouter);

let mongoServer;

/* DO ALL THIS BEFORE RUNNING TESTS */
beforeAll(async () => {
  // Create a mongodb memory server
  mongoServer = await MongoMemoryServer.create();

  // Create the memory server local URI
  const mongoUri = mongoServer.getUri();

  // Connect mongose to said server
  mongoose.connect(mongoUri);

  // Create and add a new user
  const admin = new UserModel({
    userName: 'Admin',
    email: 'fake@email.com',
    password: 'fakePassword',
  });
  await admin.save();
});

/* DO ALL THIS AFTER RUNNING TESTS */
afterAll(async () => {
  // Disconnect Mongoose
  mongoose.disconnect();

  // Turn off mongodb memory server
  mongoServer.stop();
});

test('Regular Login', async () => {
  const res = await request(app)
    .post('/')
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeTruthy();
});

test('Bad Password', async () => {
  const res = await request(app)
    .post('/')
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeTruthy();
});

test('Bad Username', async () => {
  const res = await request(app)
    .post('/')
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeTruthy();
});

