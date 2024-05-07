const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');

const loginRouter = require('../routes/loginRouter.js');
const chatRoomRouter = require('../routes/chatRoomRouter');
const apiRouter = require('../routes/api');

const UserModel = require('../models/users');
const ChatRoomModel = require('../models/chatrooms');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', apiRouter);

let mongoServer;

/* DO ALL THIS BEFORE RUNNING TESTS */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  mongoose.connect(mongoUri);
  const newUser = new UserModel({
    userName: 'ValidUser',
    email: 'fake@email.com',
    password: '$2a$12$EKvweHK.oS52QkPMnMUTfuY/qzHVoEcYl/DqCmovehwTNuvUtR6DG',
  });
  await newUser.save();
  const newChatRoom = new ChatRoomModel({
    owner: newUser._id,
  });
  await newChatRoom.save();
});

/* DO ALL THIS AFTER RUNNING TESTS */
afterAll(async () => {
  mongoose.disconnect();
  mongoServer.stop();
});

/* GET chatRooms for a user */
test('GET list of chatrooms', async () => {
  let token;
  const res1 = await request(app)
    .post('/login')
    .send({
      userName: 'ValidUser',
      password: 'fakePassword',
    })
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult1 = JSON.parse(res1.text);
  expect(parsedResult1.success).toBeTruthy();
  expect(parsedResult1.token).not.toBeUndefined();
  token = `Bearer ${parsedResult1.token}`;

  const res2 = await request(app)
    .get('/chatRoom')
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);

  const parsedResult2 = JSON.parse(res2.text);
  expect(parsedResult2.success).toBeTruthy();
});

/* Unauthorized GET request for list of chatrooms */
test('NO TOKEN: GET request for list of chatrooms', async () => {
  let token;
  const res1 = await request(app)
    .post('/login')
    .send({
      userName: 'ValidUser',
      password: 'fakePassword',
    })
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult1 = JSON.parse(res1.text);
  expect(parsedResult1.success).toBeTruthy();
  expect(parsedResult1.token).not.toBeUndefined();

  const res2 = await request(app)
    .get('/chatRoom')
    .expect('Content-Type', /json/)
    .expect(403);

  const parsedResult2 = JSON.parse(res2.text);
  expect(parsedResult2.success).toBeFalsy();
  expect(parsedResult2.message).toBe("Forbidden");
});

/* Unauthorized GET request for list of chatrooms */
test('BAD TOKEN: GET request for list of chatrooms', async () => {
  let token;
  const res1 = await request(app)
    .post('/login')
    .send({
      userName: 'ValidUser',
      password: 'fakePassword',
    })
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult1 = JSON.parse(res1.text);
  expect(parsedResult1.success).toBeTruthy();
  expect(parsedResult1.token).not.toBeUndefined();
  token = `Bearer badTokEn.${parsedResult1.token}`;

  const res2 = await request(app)
    .get('/chatRoom')
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(403);

  const parsedResult2 = JSON.parse(res2.text);
  expect(parsedResult2.success).toBeFalsy();
  expect(parsedResult2.message).toBe("Forbidden");
});

/* POST a new chatRoom from a user */
// test('POST a new chatRoom', async () => {
//   let token;
//   const res1 = await request(app)
//     .post('/login')
//     .send({
//       userName: 'ValidUser',
//       password: 'fakePassword',
//     })
//     .expect("Content-Type", /json/)
//     .expect(200);
//
//   const parsedResult = JSON.parse(res1.text);
//   expect(parsedResult.success).toBeTruthy();
//   expect(parsedResult.token).not.toBeUndefined();
//   token = `Bearer ${parsedResult.token}`;
// });

/* PUT a change to a chatRoom */
/* DELETE a chatRoom */
/* GET the details for a chatRoom */