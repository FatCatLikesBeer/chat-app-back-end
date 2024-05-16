const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const loginRouter = require('../routes/loginRouter.js');
const { MongoMemoryServer } = require('mongodb-memory-server');

const UserModel = require('../models/users');
const ChatRoomModel = require('../models/chatrooms');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', loginRouter);

let mongoServer;

/* DO ALL THIS BEFORE RUNNING TESTS */
beforeAll(async () => {
  // Create a mongodb memory server
  mongoServer = await MongoMemoryServer.create();

  // Get and store the URI of the MongoMemoryServer
  const mongoUri = await mongoServer.getUri();

  // Connect mongose to said server
  mongoose.connect(mongoUri);

  // Create & add users and chatRooms
  const newUser = new UserModel({
    userName: 'ValidUser',
    email: 'fake@email.com',
    password: '$2a$12$EKvweHK.oS52QkPMnMUTfuY/qzHVoEcYl/DqCmovehwTNuvUtR6DG',
  });
  await newUser.save();
  const differentOnwer = new UserModel({
    userName: 'DifferentPerson',
    email: 'fakej@email.com',
    password: '$2a$12$EKvweHK.oS52QkPMnMUTfuY/qzHVoEcYl/DqCmovehwTNuvUtR6DG',
  });
  await differentOnwer.save();
  const chatRoom1 = new ChatRoomModel({
    owner: newUser._id,
    participants: [newUser._id],
  })
  await chatRoom1.save();
  const chatRoom2 = new ChatRoomModel({
    owner: differentOnwer._id,
    participants: [newUser._id],
  })
  await chatRoom2.save();
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
    .send({
      userName: 'ValidUser',
      password: 'fakePassword',
    })
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeTruthy();
  expect(parsedResult.token).not.toBeUndefined();
  expect(parsedResult.data.chatRooms).not.toBeUndefined();
});

test('Username Too Short', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: '2s',
      password: 'fakePassword'
    })
    .expect("Content-Type", /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Username Empty', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: '',
      password: 'fakePassword'
    })
    .expect("Content-Type", /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Username Does Not Exist', async () => {
  const res = await request(app)
    .post('/')
    .send({
      password: 'fakePassword'
    })
    .expect("Content-Type", /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Password Too Short', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'validUserName',
      password: '2s',
    })
    .expect("Content-Type", /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Password Empty', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'validUserName',
      password: '',
    })
    .expect("Content-Type", /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Password Does Not Exist', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'validUserName',
    })
    .expect("Content-Type", /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Password & Username Empty', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: '',
      password: '',
    })
    .expect("Content-Type", /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
});

test('Username Incorrect', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'BadUserName',
      password: 'WrongPassword',
    })
    .expect("Content-Type", /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
  expect(parsedResult.message).toEqual('Username or password is incorrect');
});

test('Incorrect Password', async () => {
  const res = await request(app)
    .post('/')
    .send({
      userName: 'ValidUser',
      password: 'WrongPassword',
    })
    .expect("Content-Type", /json/)
    .expect(400);

  const parsedResult = JSON.parse(res.text);
  expect(parsedResult.success).toBeFalsy();
  expect(parsedResult.message).toEqual('Username or password is incorrect');
});
