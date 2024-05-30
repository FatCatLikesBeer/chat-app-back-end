const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { CookieAccessInfo } = require('cookiejar');

const loginRouter = require('../routes/loginRouter.js');
const chatRoomRouter = require('../routes/chatRoomRouter');
const apiRouter = require('../routes/api');

const UserModel = require('../models/users');
const ChatRoomModel = require('../models/chatrooms');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', apiRouter);

let mongoServer;
const chats = [];
const participants = [];

/* DO ALL THIS BEFORE RUNNING TESTS */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  mongoose.connect(mongoUri);

  const owner = new UserModel({
    userName: 'ValidUser',
    email: 'fake@email.com',
    password: '$2a$12$EKvweHK.oS52QkPMnMUTfuY/qzHVoEcYl/DqCmovehwTNuvUtR6DG',
  });
  await owner.save();
  const participant1 = new UserModel({
    userName: 'Participant1',
    email: 'part1@email.com',
    password: '$2a$12$EKvweHK.oS52QkPMnMUTfuY/qzHVoEcYl/DqCmovehwTNuvUtR6DG',
  });
  await participant1.save();
  const participant2 = new UserModel({
    userName: 'Participant2',
    email: 'part2@email.com',
    password: '$2a$12$EKvweHK.oS52QkPMnMUTfuY/qzHVoEcYl/DqCmovehwTNuvUtR6DG',
  });
  await participant2.save();

  const newChatRoom1 = new ChatRoomModel({
    owner: owner._id.toString(),
    participants: {
      _id: owner._id.toString(),
      userName: owner.userName,
    },
  });
  await newChatRoom1.save();
  const newChatRoom2 = new ChatRoomModel({
    owner: owner._id.toString(),
    participants: {
      _id: owner._id.toString(),
      userName: owner.userName,
    },
  });
  await newChatRoom2.save();

  participants.push(...[
    {
      _id: participant1._id,
      userName: participant1.userName
    },
    {
      _id: participant2._id,
      userName: participant2.userName
    },
  ]);
  chats.push(...[newChatRoom1._id, newChatRoom2._id]);
});

/* DO ALL THIS AFTER RUNNING TESTS */
afterAll(async () => {
  mongoose.disconnect();
  mongoServer.stop();
});

//// ---- GET REQUESTS ---- ////

/* GET chatRooms for a user */
// test('GET list of chatRooms', async () => {
//   const res1 = await request(app)
//     .post('/login')
//     .send({
//       userName: 'ValidUser',
//       password: 'fakePassword',
//     })
//     .expect("Content-Type", /json/)
//     .expect(200);
//
//   const parsedResult1 = JSON.parse(res1.text);
//   expect(parsedResult1.success).toBeTruthy();
//   expect(res1.headers['set-cookie']).not.toBeUndefined();
//   const token = res1.headers['set-cookie'][0].split('=')[1].split(';')[0];
//   expect(token).not.toBeUndefined();
//
//   const tokenData = res1.headers['set-cookie'][0].split(';')[0];
//
//   const res2 = await request(app)
//     .get('/chatRoom')
//     .set("cookie", [...res1.headers['set-cookie']])
//     .expect('Content-Type', /json/)
//     .expect(200);
//
//   console.log(res2.text);
//
//   const parsedResult2 = JSON.parse(res2.text);
//   expect(parsedResult2.success).toBeTruthy();
//   expect(res2.headers['set-cookie']).not.toBeUndefined();
//   const token1 = res2.headers['set-cookie'][0].split('=')[1].split(';')[0];
//   expect(token1).not.toBeUndefined();
//   expect(parsedResult2.data).not.toBeUndefined();
//   expect(parsedResult2.data.length).toBe(2);
// });

////// ---- POST REQUESTS ---- ////
//
///* POST a new chatRoom from a user */
//test('POST a new chatRoom', async () => {
//  let token;
//  const res1 = await request(app)
//    .post('/login')
//    .send({
//      userName: 'ValidUser',
//      password: 'fakePassword',
//    })
//    .expect("Content-Type", /json/)
//    .expect(200);
//
//  const parsedResult1 = JSON.parse(res1.text);
//  expect(parsedResult1.success).toBeTruthy();
//  expect(parsedResult1.token).not.toBeUndefined();
//  token = `Bearer=${parsedResult1.token}`;
//
//  const res2 = await request(app)
//    .post('/chatRoom')
//    .set('cookie', token)
//    .expect('Content-Type', /json/)
//    .expect(200);
//
//  const parsedResult2 = JSON.parse(res2.text);
//  expect(parsedResult2.success).toBeTruthy();
//  expect(parsedResult2.token).not.toBeUndefined();
//  expect(parsedResult2.data).not.toBeUndefined();
//  expect(parsedResult2.data.length).toBe(3);
//});
//
////// ---- PUT REQUESTS ---- ////
//
///* PUT new participants in chatRoom[0] */
//test('PUT new participants in a chatRoom[0]', async () => {
//  let token;
//  const res1 = await request(app)
//    .post('/login')
//    .send({
//      userName: 'ValidUser',
//      password: 'fakePassword',
//    })
//    .expect("Content-Type", /json/)
//    .expect(200);
//
//  const parsedResult1 = JSON.parse(res1.text);
//  expect(parsedResult1.success).toBeTruthy();
//  expect(parsedResult1.token).not.toBeUndefined();
//  token = `Bearer=${parsedResult1.token}`;
//
//  const res2 = await request(app)
//    .put('/chatRoom')
//    .set('cookie', token)
//    .send({
//      chatRoom: chats[0],
//      add: [participants[0], participants[1]],
//      remove: undefined,
//      chown: undefined,
//    })
//    .expect('Content-Type', /json/)
//    .expect(200);
//
//  const parsedResult2 = JSON.parse(res2.text);
//  expect(parsedResult2.success).toBeTruthy();
//  expect(parsedResult2.token).not.toBeUndefined();
//  expect(parsedResult2.data).not.toBeUndefined();
//  expect(parsedResult2.data.length).toBe(3);
//});
//
///* PUT new participants in chatRoom[1] */
//test('PUT new participants in chatRoom[1]', async () => {
//  let token;
//  const res1 = await request(app)
//    .post('/login')
//    .send({
//      userName: 'ValidUser',
//      password: 'fakePassword',
//    })
//    .expect("Content-Type", /json/)
//    .expect(200);
//
//  const parsedResult1 = JSON.parse(res1.text);
//  expect(parsedResult1.success).toBeTruthy();
//  expect(parsedResult1.token).not.toBeUndefined();
//  token = `Bearer=${parsedResult1.token}`;
//
//  const res2 = await request(app)
//    .put('/chatRoom')
//    .set('cookie', token)
//    .send({
//      chatRoom: chats[1],
//      add: [participants[0], participants[1]],
//    })
//    .expect('Content-Type', /json/)
//    .expect(200);
//
//  const parsedResult2 = JSON.parse(res2.text);
//  expect(parsedResult2.success).toBeTruthy();
//  expect(parsedResult2.token).not.toBeUndefined();
//  expect(parsedResult2.data).not.toBeUndefined();
//  expect(parsedResult2.data.length).toBe(3);
//});
//
///* PUT Changes to chatRoom[1], remove participant & change onwer */
//test('PUT Changes to chatRoom[1]: remove participant & change onwer', async () => {
//  let token;
//  const res1 = await request(app)
//    .post('/login')
//    .send({
//      userName: 'ValidUser',
//      password: 'fakePassword',
//    })
//    .expect("Content-Type", /json/)
//    .expect(200);
//
//  const parsedResult1 = JSON.parse(res1.text);
//  expect(parsedResult1.success).toBeTruthy();
//  expect(parsedResult1.token).not.toBeUndefined();
//  token = `Bearer=${parsedResult1.token}`;
//
//  const res2 = await request(app)
//    .put('/chatRoom')
//    .set('cookie', token)
//    .send({
//      chatRoom: chats[1],
//      chown: participants[1],
//      remove: [participants[0]],
//    })
//    .expect('Content-Type', /json/)
//    .expect(200);
//
//  const parsedResult2 = JSON.parse(res2.text);
//  expect(parsedResult2.success).toBeTruthy();
//  expect(parsedResult2.token).not.toBeUndefined();
//  expect(parsedResult2.data).not.toBeUndefined();
//  expect(parsedResult2.data.length).toBe(2);
//});
//
///* GET chatRooms for new owner of chatRoom[1] */
//test('GET chatRooms for new owner of chatRoom[1]', async () => {
//  let token;
//  const res1 = await request(app)
//    .post('/login')
//    .send({
//      userName: 'Participant2',
//      password: 'fakePassword',
//    })
//    .expect("Content-Type", /json/)
//    .expect(200);
//
//  const parsedResult1 = JSON.parse(res1.text);
//  expect(parsedResult1.success).toBeTruthy();
//  expect(parsedResult1.token).not.toBeUndefined();
//  token = `Bearer=${parsedResult1.token}`;
//
//  const res2 = await request(app)
//    .get('/chatRoom')
//    .set('cookie', token)
//    .expect('Content-Type', /json/)
//    .expect(200);
//
//  const parsedResult2 = JSON.parse(res2.text);
//  expect(parsedResult2.success).toBeTruthy();
//  expect(parsedResult2.token).not.toBeUndefined();
//  expect(parsedResult2.data).not.toBeUndefined();
//  expect(parsedResult2.data.length).toBe(2);
//  expect(parsedResult2.data[0].participants.length).toBe(3);
//});
//
///* PUT No Token remove participant */
//test('PUT: NO TOKEN remove participant', async () => {
//  let token;
//  const res1 = await request(app)
//    .post('/login')
//    .send({
//      userName: 'ValidUser',
//      password: 'fakePassword',
//    })
//    .expect("Content-Type", /json/)
//    .expect(200);
//
//  const parsedResult1 = JSON.parse(res1.text);
//  expect(parsedResult1.success).toBeTruthy();
//  expect(parsedResult1.token).toBeDefined();
//
//  const res2 = await request(app)
//    .get('/chatRoom')
//    .expect('Content-Type', /json/)
//    .expect(403);
//
//  const parsedResult2 = JSON.parse(res2.text);
//  expect(parsedResult2.success).toBeFalsy();
//  expect(parsedResult2.message).toBe("Forbidden");
//});
//
///* PUT Bad Token Change Owner */
//test('PUT: BAD TOKEN new chatRoom owner', async () => {
//  let token;
//  const res1 = await request(app)
//    .post('/login')
//    .send({
//      userName: 'ValidUser',
//      password: 'fakePassword',
//    })
//    .expect("Content-Type", /json/)
//    .expect(200);
//
//  const parsedResult1 = JSON.parse(res1.text);
//  expect(parsedResult1.success).toBeTruthy();
//  expect(parsedResult1.token).not.toBeUndefined();
//  token = `Bearer=badTokEn.${parsedResult1.token}`;
//
//  const res2 = await request(app)
//    .get('/chatRoom')
//    .set('cookie', token)
//    .expect('Content-Type', /json/)
//    .expect(403);
//
//  const parsedResult2 = JSON.parse(res2.text);
//  expect(parsedResult2.success).toBeFalsy();
//  expect(parsedResult2.message).toBe("Forbidden");
//});
//
////// ---- DELETE REQUESTS ---- ////
//
///* DELETE a chatRoom */
//test('DELETE a chatRoom', async () => {
//  let token;
//  const res1 = await request(app)
//    .post('/login')
//    .send({
//      userName: 'ValidUser',
//      password: 'fakePassword',
//    })
//    .expect("Content-Type", /json/)
//    .expect(200);
//
//  const parsedResult1 = JSON.parse(res1.text);
//  expect(parsedResult1.success).toBeTruthy();
//  expect(parsedResult1.token).toBeDefined();
//  token = `Bearer=${parsedResult1.token}`;
//
//  const getChats = await request(app)
//    .get('/chatRoom')
//    .set('cookie', token)
//    .expect(200)
//
//  const getChatsParsed = JSON.parse(getChats.text);
//  const chatRooms = getChatsParsed.data;
//  token = `Bearer=${getChatsParsed.token}`;
//
//  const res2 = await request(app)
//    .delete('/chatRoom')
//    .set('cookie', token)
//    .send({
//      chatRoom: chatRooms[0],
//    })
//    .expect('Content-Type', /json/)
//    .expect(200);
//
//  const parsedResult2 = JSON.parse(res2.text);
//  expect(parsedResult2.success).toBeTruthy();
//  expect(parsedResult2.message).toBe("chatRoom successfully deleted");
//});

describe("Cookie handling", () => {
  const agent = request.agent(app);
  const accessInfo = CookieAccessInfo();
  let cookie;
  it("It should login & set cookie", async () => {
    const loginResponse = await agent
      .post('/login')
      .send({
        'userName': 'ValidUser',
        'password': 'fakePassword',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    cookie = loginResponse.get('set-cookie')[0];

    expect(cookie).toBeDefined();
    expect(cookie.split('=')[0]).toMatch("Barer");
  });

  it("It should successfully use cookie at /chatRoom", async () => {
    const chatRoomResponse = await agent
      .get('/chatRoom')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(chatRoomResponse.status).toBeTruthy();
  });
});
