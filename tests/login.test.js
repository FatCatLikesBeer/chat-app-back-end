const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = express();
const loginRouter = require('../routes/loginRouter.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', loginRouter);

let mongoServer;

const User = mongoose.model('User', {
  userName: String,
  password: String,
});

beforeAll(async () => {
  // Create a mongodb memory server
  mongoServer = await MongoMemoryServer.create();

  // Create the memory server local URI
  const mongoUri = mongoServer.getUri();

  // Connect mongose to said server
  mongoose.connect(mongoUri);

  // Add users
});

afterAll(async () => {
  // Disconnect Mongoose
  mongoose.disconnect();

  // Turn off mongodb memory server
  mongoServer.stop();
});

test('Index route', async () => {
  const res = await request(app)
    .get('/')
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeTruthy();
});
