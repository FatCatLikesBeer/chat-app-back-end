const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const signUpRouter = require('../routes/signUpRouter');
const { MongoMemoryServer } = require('mongodb-memory-server');

const UserModel = require('../models/users');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', signUpRouter);

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

test('Good Signup', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'sdlfkjuweoiu383838',
      password: 'plentygoodpassword',
      email: 'good@email.com'
    })
    .expect('Content-Type', /json/)
    // .expect(200);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.token).not.toBeUndefined();
  expect(parsedResult.success).toBeTruthy();
});

test('Username Already Taken', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'Admin',
      password: 'plentygoodpassword',
      email: 'good@email.com'
    })
    .expect('Content-Type', /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Username Empty', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: '',
      password: 'plentygoodpassword',
      email: 'good@email.com'
    })
    .expect('Content-Type', /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Username Too Short', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'sq',
      password: 'plentygoodpassword',
      email: 'good@email.com'
    })
    .expect('Content-Type', /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Username Too Long', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'lskdjflskdjfwoeiruwoeiru293847293847',
      password: 'plentygoodpassword',
      email: 'good@email.com'
    })
    .expect('Content-Type', /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Password too short', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'sldk982lsdiku',
      password: 'seven',
      email: 'good@email.com'
    })
    .expect('Content-Type', /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Invalid Email', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'slie8656',
      password: 'plentygoodpassword',
      email: 'slkdjflskdjfwoieruwoeiru293847293847',
    })
    .expect('Content-Type', /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});
