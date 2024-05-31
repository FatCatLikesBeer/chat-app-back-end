const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { MongoMemoryServer } = require('mongodb-memory-server');

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

  const partipant1 = new UserModel({
    userName: 'Participant1',
    email: 'part1@email.com',
    password: '$2a$12$EKvweHK.oS52QkPMnMUTfuY/qzHVoEcYl/DqCmovehwTNuvUtR6DG',
  });
  await partipant1.save();

  const partipant2 = new UserModel({
    userName: 'Partipant2',
    email: 'part2@email.com',
    password: '$2a$12$EKvweHK.oS52QkPMnMUTfuY/qzHVoEcYl/DqCmovehwTNuvUtR6DG',
  });
  await partipant2.save();

  const newChatRoom1 = new ChatRoomModel({ owner: owner._id, }); await newChatRoom1.save();
  const newChatRoom2 = new ChatRoomModel({ owner: owner._id, }); await newChatRoom2.save();

  participants.push(...[partipant1._id, partipant2._id]);
  chats.push(...[newChatRoom1._id, newChatRoom2._id]);
});

/* DO ALL THIS AFTER RUNNING TESTS */
afterAll(async () => {
  mongoose.disconnect();
  mongoServer.stop();
});

/* Testing out middlware refactoring */
describe('Testing out middleware refactoring', () => {
  const agent = request.agent(app);
  it('Login & get cookie?', async () => {
    const res1 = await agent
      .post('/login')
      .send({
        userName: 'ValidUser',
        password: 'fakePassword',
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const parsedResult1 = JSON.parse(res1.text);
    expect(parsedResult1.success).toBeTruthy();
  });

  it("GET /test route (I'm not sure what this route does)", async () => {
    const res2 = await agent
      .get('/test')
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult2 = JSON.parse(res2.text);
    expect(parsedResult2.success).toBeTruthy();
    expect(parsedResult2.data).not.toBeUndefined();
  });
});

