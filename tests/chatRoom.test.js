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
    userName: 'Participant2',
    email: 'part2@email.com',
    password: '$2a$12$EKvweHK.oS52QkPMnMUTfuY/qzHVoEcYl/DqCmovehwTNuvUtR6DG',
  });
  await participant2.save();

  // Create ChatRooms
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

  // Consolidate User & Chatrooms
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
  // Clean up stuff
  mongoose.disconnect();
  mongoServer.stop();
});

//// ---- GET REQUESTS ---- ////
/* GET chatRooms for a ValidUser */
describe("Get list of chatRooms(s)", () => {
  const agent = request.agent(app);
  let cookie;
  it("Successfully log in & recieve a cookie with name: 'Barer'", async () => {
    const loginResponse = await agent
      .post('/login')
      .send({
        userName: 'ValidUser',
        password: 'fakePassword',
      })
      .expect("Content-Type", /json/)
      .expect(200);

    cookie = loginResponse.get('set-cookie')[0];
    expect(cookie).toBeDefined();
    expect(cookie.split("=")[0]).toMatch('Barer');
  });

  it("Successfully use cookie to get array of chatRooms", async () => {
    const chatRoomResponse = await agent
      .get('/chatRoom')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(chatRoomResponse.status).toBeTruthy();
  });
});

//// ---- POST REQUESTS ---- ////
/* POST a new chatRoom from a user */
describe("Post a new chatroom from a user", () => {
  const agent = request.agent(app);
  let cookie;
  it("Successfully log in & recieve a cookie with name: 'Barer'", async () => {
    const loginResponse = await agent
      .post('/login')
      .send({
        userName: 'ValidUser',
        password: 'fakePassword',
      })
      .expect("Content-Type", /json/)
      .expect(200);

    cookie = loginResponse.get('set-cookie')[0];
    expect(cookie).toBeDefined();
    expect(cookie.split("=")[0]).toMatch('Barer');
  });

  it("Create a third, new chatRoom with the aid of cookie data", async () => {
    const postChatRoom = await agent
      .post('/chatRoom')
      .expect('Content-Type', /json/)
      .expect(200)

    const postChatRoomResult = JSON.parse(postChatRoom.text);
    expect(postChatRoomResult.success).toBeTruthy();
    expect(postChatRoomResult.data).not.toBeUndefined();
    expect(postChatRoomResult.data.length).toBe(3);
  });
});

//// ---- PUT REQUESTS ---- ////
describe("PUT new participants in chatRoom[0]", () => {
  let cookie;
  const agent = request.agent(app);
  it("Login & get cookie", async () => {
    const loginResponse = await agent
      .post('/login')
      .send({
        userName: 'ValidUser',
        password: 'fakePassword',
      })
      .expect('Content-Type', /json/)
      .expect(200)

    cookie = loginResponse.get('set-cookie')[0];
    expect(cookie).toBeDefined();
    expect(cookie.split("=")[0]).toMatch('Barer');
  });
  it("Make changes to chatRoom", async () => {
    const putResponse = await agent
      .put('/chatRoom')
      .send({
        chatRoom: chats[0],
        add: [participants[0], participants[1]],
        remove: undefined,
        chown: undefined,
      })
      .expect('Content-Type', /json/)
      .expect(200)

    const parsedPutResponse = JSON.parse(putResponse.text);
    expect(parsedPutResponse.success).toBeTruthy();
    expect(parsedPutResponse.data).toBeDefined();
    expect(parsedPutResponse.data.length).toBe(3);
  });
});

describe('PUT new participans in chatRoom[1]', () => {
  let cookie;
  const agent = request.agent(app);
  it("Login & get cookie", async () => {
    const loginResponse = await agent
      .post('/login')
      .send({
        userName: 'ValidUser',
        password: 'fakePassword',
      })
      .expect('Content-Type', /json/)
      .expect(200)

    cookie = loginResponse.get('set-cookie')[0];
    expect(cookie).toBeDefined();
    expect(cookie.split("=")[0]).toMatch('Barer');
  });
  it('PUT new participants to chatRoom[1]', async () => {
    const putResponse = await agent
      .put('/chatRoom')
      .send({
        chatRoom: chats[1],
        add: [participants[0], participants[1]],
      })
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult2 = JSON.parse(putResponse.text);
    expect(parsedResult2.success).toBeTruthy();
    expect(parsedResult2.data).not.toBeUndefined();
    expect(parsedResult2.data.length).toBe(3);
  });
});

/* PUT Changes to chatRoom[1], remove participant & change onwer */
describe('PUT Changes to chatRoom[1]: remove participant & change onwer', () => {
  let cookie;
  const agent = request.agent(app);
  it('Login Successfully & get cookie', async () => {
    const loginResponse = await agent
      .post('/login')
      .send({
        userName: 'ValidUser',
        password: 'fakePassword',
      })
      .expect('Content-Type', /json/)
      .expect(200)

    cookie = loginResponse.get('set-cookie')[0];
    expect(cookie).toBeDefined();
    expect(cookie.split("=")[0]).toMatch('Barer');
  });

  it('PUT changes: Remove participant & change onwer', async () => {
    const putResponse = await agent
      .put('/chatRoom')
      .send({
        chatRoom: chats[1],
        chown: participants[1],
        remove: [participants[0]],
      })
      .expect('Content-Type', /json/)
      .expect(200)

    const parsedResult = JSON.parse(putResponse.text);
    expect(parsedResult.success).toBeTruthy();
    expect(parsedResult.data).toBeDefined();
    expect(parsedResult.data.length).toBe(2);
  });
});

describe('GET chatRooms for new owner of chatRoom[1]', () => {
  let cookie;
  const agent = request.agent(app);
  it('Login Successfully & get cookie', async () => {
    const loginResponse = await agent
      .post('/login')
      .send({
        userName: 'Participant2',
        password: 'fakePassword',
      })
      .expect("Content-Type", /json/)
      .expect(200);

    cookie = loginResponse.get('set-cookie')[0];
    expect(cookie).toBeDefined();
    expect(cookie.split("=")[0]).toMatch('Barer');
  });

  it('GET chatRooms for new owner of chatRoom[1]', async () => {
    const getResponse = await agent
      .get('/chatRoom')
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult = JSON.parse(getResponse.text);
    expect(parsedResult.success).toBeTruthy();
    expect(parsedResult.data).not.toBeUndefined();
    expect(parsedResult.data.length).toBe(2);
    expect(parsedResult.data[0].participants.length).toBe(3);
  });
});

/* PUT No Token remove participant */
describe('PUT: No TOKEN remove participant', () => {
  const agent = request.agent(app);
  let cookie
  const accessInfo = {
    domain: '127.0.0.1',
    path: '/'
  };
  it('Login Successfully & get cookie', async () => {
    const loginResponse = await agent
      .post('/login')
      .send({
        userName: 'Participant2',
        password: 'fakePassword',
      })
      .expect("Content-Type", /json/)
      .expect(200);

    cookie = loginResponse.get('set-cookie')[0];
    expect(cookie).toBeDefined();
    expect(cookie.split("=")[0]).toMatch('Barer');

    // The following method must happen inside the function
    // It looks better after the it() function, but it
    // oddly get hoisted...
    agent.jar.setCookie('Barer=badData', '127.0.0.1'); //setCookie() two values
  });

  it("Manipulate cookie: remove token, return '401: Unauthorized'", async () => {
    const badToken = await agent
      .put('/chatRoom')
      .send({
        remove: [participants[0]],
      })
      .expect('Content-Type', /json/)
      .expect(401)

    const parsedBadToken = JSON.parse(badToken.text);
    expect(parsedBadToken.status).toBeFalsy();
    expect(parsedBadToken.message).toMatch('Unauthorized');
  });
});

//// ---- DELETE REQUESTS ---- ////
/* DELETE a chatRoom */
describe("DELETE a chatRoom", () => {
  const agent = request.agent(app);
  let cookie
  it('Login Successfully & get cookie', async () => {
    const loginResponse = await agent
      .post('/login')
      .send({
        userName: 'Participant2',
        password: 'fakePassword',
      })
      .expect("Content-Type", /json/)
      .expect(200);

    cookie = loginResponse.get('set-cookie')[0];
    expect(cookie).toBeDefined();
    expect(cookie.split("=")[0]).toMatch('Barer');
  });

  it('DELETE request to delete a chatRoom', async () => {
    const deleteResponse = await agent
      .delete('/chatRoom')
      .send({ chatRoom: chats[0] })
      .expect('Content-Type', /json/)
      .expect(200)

    const parsedDelete = JSON.parse(deleteResponse.text);
    expect(parsedDelete.success).toBeTruthy();
    expect(parsedDelete.message).toMatch('chatRoom successfully deleted');
  });
});
