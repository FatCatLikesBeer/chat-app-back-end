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

  // Get and store the URI of the MongoMemoryServer
  const mongoUri = await mongoServer.getUri();

  // Connect mongose to said server
  mongoose.connect(mongoUri);

  // Create and add a new user
  const admin = new UserModel({
    userName: 'DuplicateUserName',
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
      userName: 'GoodUserName',
      password: 'plentygoodpassword',
      email: 'good@email.com'
    })
    .expect('Content-Type', /json/)
    .expect(200);

  const parsedResult = JSON.parse(res.text);
  expect(res.headers['set-cookie']).not.toBeUndefined();
  const token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];
  expect(token).not.toBeUndefined();
  expect(parsedResult.success).toBeTruthy();
});

test('Username Already Taken', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'DuplicateUserName',
      password: 'plentygoodpassword',
      email: 'good@email.com'
    })
    .expect('Content-Type', /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
  expect(parsedResult.message).toBe('Username already exists');
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
      userName: '2s',
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
      userName: 'This Username Is Supposed To Be Very Very Very Long',
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
      password: '56seven',
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
      email: 'This In An Example Of A String That\'s Not An Email',
    })
    .expect('Content-Type', /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Email Already Used', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'UniqueUsername',
      password: 'plentygoodpassword',
      email: 'fake@email.com'
    })
    .expect('Content-Type', /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
  expect(parsedResult.message).toBe('Email already in use');
});


