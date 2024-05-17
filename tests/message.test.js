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
const MessageModel = require('../models/messages');

const app = express();
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

  // Create Users
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
    userName: 'participant2',
    email: 'part2@email.com',
    password: '$2a$12$EKvweHK.oS52QkPMnMUTfuY/qzHVoEcYl/DqCmovehwTNuvUtR6DG',
  });
  await participant2.save();

  // Create chatRooms
  const newChatRoom1 = new ChatRoomModel({
    owner: owner._id,
  });
  await newChatRoom1.save();
  const newChatRoom2 = new ChatRoomModel({
    owner: owner._id,
  });
  await newChatRoom2.save();

  // Create messages
  const message1 = new MessageModel({
    author: {
      _id: owner._id,
      userName: owner.userName,
    },
    chatRoom: newChatRoom1._id,
    message: "First message ever!"
  });
  await message1.save();
  const message2 = new MessageModel({
    author: {
      _id: owner._id,
      userName: owner.userName,
    },
    chatRoom: newChatRoom1._id,
    message: "Second Message heeere"
  });
  await message2.save();
  const message3 = new MessageModel({
    author: {
      _id: participant1._id,
      userName: participant1.userName,
    },
    chatRoom: newChatRoom1._id,
    message: "Part1's first message ever!"
  });
  await message3.save();

  participants.push(...[participant1._id, participant2._id]);
  chats.push(...[newChatRoom1._id, newChatRoom2._id]);
});

/* DO ALL THIS AFTER RUNNING TESTS */
afterAll(async () => {
  mongoose.disconnect();
  mongoServer.stop();
});

//// ---- GET REQUESTS ---- ////
test('GET List of messages in a chatRoom', async () => {
  let token;
  const firstLogin = await request(app)
    .post('/login')
    .send({
      userName: 'ValidUser',
      password: 'fakePassword',
    })
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult1 = JSON.parse(firstLogin.text);
  expect(parsedResult1.success).toBeTruthy();
  expect(parsedResult1.token).not.toBeUndefined();
  token = `Bearer ${parsedResult1.token}`;

  const getListOfChatRooms = await request(app)
    .get('/chatRoom')
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);

  const parsedResult2 = JSON.parse(getListOfChatRooms.text);
  expect(parsedResult2.success).toBeTruthy();
  expect(parsedResult2.token).not.toBeUndefined();
  expect(parsedResult2.data).not.toBeUndefined();
  token = `Bearer ${parsedResult2.token}`;

  const getLastFiftyMessages = await request(app)
    .get('/message')
    .send({
      chatRoom: chats[0]._id,
    })
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);

  const parsedResult3 = JSON.parse(getLastFiftyMessages.text);
  expect(parsedResult3.success).toBeTruthy();
  expect(parsedResult3.token).not.toBeUndefined();
  expect(parsedResult3.data).not.toBeUndefined();
  expect(parsedResult3.data.length).toBe(3);
});

//// ---- POST REQUESTS ---- ////
test('POST some messages into a chatroom', async () => {
  let token;
  const firstLogin = await request(app)
    .post('/login')
    .send({
      userName: 'ValidUser',
      password: 'fakePassword',
    })
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult1 = JSON.parse(firstLogin.text);
  expect(parsedResult1.success).toBeTruthy();
  expect(parsedResult1.token).not.toBeUndefined();
  token = `Bearer ${parsedResult1.token}`;

  const getListOfChatRooms = await request(app)
    .get('/chatRoom')
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);

  const parsedResult2 = JSON.parse(getListOfChatRooms.text);
  expect(parsedResult2.success).toBeTruthy();
  expect(parsedResult2.token).not.toBeUndefined();
  expect(parsedResult2.data).not.toBeUndefined();
  token = `Bearer ${parsedResult2.token}`;

  const createMessage = await request(app)
    .post('/message')
    .send({
      chatRoom: chats[0]._id,
      message: "This post was made OUTSIDE the test and inside the controller 😃"
    })
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);

  const parsedResult3 = JSON.parse(createMessage.text);
  expect(parsedResult3.success).toBeTruthy();
  expect(parsedResult3.token).not.toBeUndefined();
  expect(parsedResult3.data).not.toBeUndefined();
  expect(parsedResult3.data.length).toBe(4);
});

//// ---- PUT REQUESTS ---- ////
test('PUT an edit to a message', async () => {
  let token;
  const firstLogin = await request(app)
    .post('/login')
    .send({
      userName: 'ValidUser',
      password: 'fakePassword',
    })
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult1 = JSON.parse(firstLogin.text);
  expect(parsedResult1.success).toBeTruthy();
  expect(parsedResult1.token).not.toBeUndefined();
  token = `Bearer ${parsedResult1.token}`;

  const getListOfChatRooms = await request(app)
    .get('/chatRoom')
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);

  const parsedResult2 = JSON.parse(getListOfChatRooms.text);
  expect(parsedResult2.success).toBeTruthy();
  expect(parsedResult2.token).not.toBeUndefined();
  expect(parsedResult2.data).not.toBeUndefined();
  token = `Bearer ${parsedResult2.token}`;

  const getLastFiftyMessages = await request(app)
    .get('/message')
    .send({
      chatRoom: chats[0]._id,
    })
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);
  const parsedResult3 = JSON.parse(getLastFiftyMessages.text);
  token = `Bearer ${parsedResult3.token}`;
  message = parsedResult3.data[0];

  const editMessage = await request(app)
    .put('/message')
    .send({
      edit: "This post was made technically SAVED outside the test and inside the controller 😉",
      chatRoom: message.chatRoom,
      message: message,
    })
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);

  const parsedResult4 = JSON.parse(editMessage.text);
  expect(parsedResult4.success).toBeTruthy();
  expect(parsedResult4.token).not.toBeUndefined();
  expect(parsedResult4.data).not.toBeUndefined();
  expect(parsedResult4.data.length).toBe(4);
  expect(parsedResult4.data[0].message).toBe('This post was made technically SAVED outside the test and inside the controller 😉');
});

//// ---- DELETE REQUESTS ---- ////
test('DELETE a message', async () => {
  let token;
  const firstLogin = await request(app)
    .post('/login')
    .send({
      userName: 'ValidUser',
      password: 'fakePassword',
    })
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult1 = JSON.parse(firstLogin.text);
  expect(parsedResult1.success).toBeTruthy();
  expect(parsedResult1.token).not.toBeUndefined();
  token = `Bearer ${parsedResult1.token}`;

  const getListOfChatRooms = await request(app)
    .get('/chatRoom')
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);

  const parsedResult2 = JSON.parse(getListOfChatRooms.text);
  expect(parsedResult2.success).toBeTruthy();
  expect(parsedResult2.token).not.toBeUndefined();
  expect(parsedResult2.data).not.toBeUndefined();
  token = `Bearer ${parsedResult2.token}`;

  const getLastFiftyMessages = await request(app)
    .get('/message')
    .send({
      chatRoom: chats[0]._id,
    })
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);
  const parsedResult3 = JSON.parse(getLastFiftyMessages.text);
  token = `Bearer ${parsedResult3.token}`;
  message = parsedResult3.data[0];

  const deleteMessage = await request(app)
    .delete('/message')
    .send({
      message: message,
    })
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);

  const parsedResult4 = JSON.parse(deleteMessage.text);
  expect(parsedResult4.success).toBeTruthy();
  expect(parsedResult4.message).toBe("Message successfully deleted");
});

//// ---- GET REQUEST: Bad chatRoom var ---- ////
test('GET: Bad chatRoom var', async () => {
  let token;
  const firstLogin = await request(app)
    .post('/login')
    .send({
      userName: 'ValidUser',
      password: 'fakePassword',
    })
    .expect("Content-Type", /json/)
    .expect(200);

  const parsedResult1 = JSON.parse(firstLogin.text);
  expect(parsedResult1.success).toBeTruthy();
  expect(parsedResult1.token).not.toBeUndefined();
  token = `Bearer ${parsedResult1.token}`;

  const getListOfChatRooms = await request(app)
    .get('/chatRoom')
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(200);

  const parsedResult2 = JSON.parse(getListOfChatRooms.text);
  expect(parsedResult2.success).toBeTruthy();
  expect(parsedResult2.token).not.toBeUndefined();
  expect(parsedResult2.data).not.toBeUndefined();
  token = `Bearer ${parsedResult2.token}`;

  const badChatRoomVar = await request(app)
    .get('/message')
    .send({
      chatRoom: 'undefined',
    })
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(500);

  const parsedResult3 = JSON.parse(badChatRoomVar.text);
  expect(parsedResult3.success).toBeFalsy();
  expect(parsedResult3.token).not.toBeUndefined();
  expect(parsedResult3.message).not.toBeUndefined();
});

//// ---- Testing Middleware Failues ---- ////
test('NO Token', async () => {
  const getListOfChatRooms = await request(app)
    .get('/message')
    .expect('Content-Type', /json/)
    .expect(403);

  const parsedResult = JSON.parse(getListOfChatRooms.text);
  expect(parsedResult.success).toBeFalsy();
  expect(parsedResult.token).toBeUndefined();
  expect(parsedResult.data).toBeUndefined();
  expect(parsedResult.message).toBe("Forbidden");
});

test('BAD Token', async () => {
  const token = "Bearer sldkfj2o8374lskdjf..skdfjlkxjcvolil98234.sldkfjowieur982734";
  const getListOfChatRooms = await request(app)
    .get('/message')
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect(403);

  const parsedResult = JSON.parse(getListOfChatRooms.text);
  expect(parsedResult.success).toBeFalsy();
  expect(parsedResult.token).toBeUndefined();
  expect(parsedResult.data).toBeUndefined();
  expect(parsedResult.message).toBe("Forbidden");
});
