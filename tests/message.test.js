const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { MongoMemoryServer } = require('mongodb-memory-server');

const apiRouter = require('../routes/api');

const UserModel = require('../models/users');
const ChatRoomModel = require('../models/chatrooms');
const MessageModel = require('../models/messages');

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
describe('GET List of messages in a chatRoom', () => {
  const agent = request.agent(app);
  let cookie;
  it('Login & get cookie', async () => {
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

    const parsedResult1 = JSON.parse(loginResponse.text);
    expect(parsedResult1.success).toBeTruthy();
  });

  it('GET list of chatRoom', async () => {
    const getListOfChatRooms = await agent
      .get('/chatRoom')
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult2 = JSON.parse(getListOfChatRooms.text);
    expect(parsedResult2.success).toBeTruthy();
    expect(parsedResult2.data).not.toBeUndefined();
  });

  it('GET messages from a chatRoom', async () => {
    const getLastFiftyMessages = await agent
      .get(`/message/${chats[0]._id.toString()}`)
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult3 = JSON.parse(getLastFiftyMessages.text);
    expect(parsedResult3.success).toBeTruthy();
    expect(parsedResult3.data).not.toBeUndefined();
    expect(parsedResult3.data.length).toBe(3);
  });
});

//// ---- POST REQUESTS ---- ////
describe('POST some messages into a chatroom', () => {
  const agent = request.agent(app);
  let cookie;
  it('Login & get cookie', async () => {
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

    const parsedResult1 = JSON.parse(loginResponse.text);
    expect(parsedResult1.success).toBeTruthy();
  });

  it('GET list of chatRooms', async () => {
    const getListOfChatRooms = await agent
      .get('/chatRoom')
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult2 = JSON.parse(getListOfChatRooms.text);
    expect(parsedResult2.success).toBeTruthy();
    expect(parsedResult2.data).not.toBeUndefined();
  });

  it('POST message to chats[0]', async () => {
    const createMessage = await agent
      .post('/message')
      .send({
        chatRoom: chats[0]._id,
        message: "This post was made OUTSIDE the test and inside the controller 😃"
      })
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult3 = JSON.parse(createMessage.text);
    expect(parsedResult3.success).toBeTruthy();
    expect(parsedResult3.data).not.toBeUndefined();
    expect(parsedResult3.data.length).toBe(4);
  });
});

//// ---- PUT REQUESTS ---- ////
describe('PUT an edit to a message', () => {
  const agent = request.agent(app);
  let cookie;
  it('Login & get cookie', async () => {
    const firstLogin = await agent
      .post('/login')
      .send({
        userName: 'ValidUser',
        password: 'fakePassword',
      })
      .expect("Content-Type", /json/)
      .expect(200);

    cookie = firstLogin.get('set-cookie')[0];
    expect(cookie).toBeDefined();
    expect(cookie.split("=")[0]).toMatch('Barer');

    const parsedResult1 = JSON.parse(firstLogin.text);
    expect(parsedResult1.success).toBeTruthy();
  });

  it('GET list of chatRooms', async () => {
    const getListOfChatRooms = await agent
      .get('/chatRoom')
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult2 = JSON.parse(getListOfChatRooms.text);
    expect(parsedResult2.success).toBeTruthy();
    expect(parsedResult2.data).not.toBeUndefined();
  });

  it('GET list of messages for a chatRoom', async () => {
    const getLastFiftyMessages = await agent
      .get(`/message/${chats[0]._id}`)
      .expect('Content-Type', /json/)
      .expect(200);
    const parsedResult3 = JSON.parse(getLastFiftyMessages.text);
    message = parsedResult3.data[0];
  });

  it('PUT changes to a message', async () => {
    const editMessage = await agent
      .put('/message')
      .send({
        edit: "This post was made technically SAVED outside the test and inside the controller 😉",
        chatRoom: message.chatRoom,
        message: message,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult4 = JSON.parse(editMessage.text);
    expect(parsedResult4.success).toBeTruthy();
    expect(parsedResult4.data).not.toBeUndefined();
    expect(parsedResult4.data.length).toBe(4);
    expect(parsedResult4.data[0].message).toBe('This post was made technically SAVED outside the test and inside the controller 😉');
  });
});

//// ---- DELETE REQUESTS ---- ////
describe('DELETE a message', () => {
  const agent = request.agent(app);
  let cookie;
  it('Login & get cookie', async () => {
    const firstLogin = await agent
      .post('/login')
      .send({
        userName: 'ValidUser',
        password: 'fakePassword',
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const parsedResult1 = JSON.parse(firstLogin.text);
    expect(parsedResult1.success).toBeTruthy();
  });

  it('GET list of chatRooms', async () => {
    const getListOfChatRooms = await agent
      .get('/chatRoom')
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult2 = JSON.parse(getListOfChatRooms.text);
    expect(parsedResult2.success).toBeTruthy();
    expect(parsedResult2.data).not.toBeUndefined();
  });

  it('GET messages from a chatRoom', async () => {
    const getLastFiftyMessages = await agent
      .get(`/message/${chats[0]._id}`)
      .send({
        chatRoom: chats[0]._id,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult3 = JSON.parse(getLastFiftyMessages.text);
    message = parsedResult3.data[0];
  });

  it('DELETE a message', async () => {
    const deleteMessage = await agent
      .delete('/message')
      .send({
        message: message,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult4 = JSON.parse(deleteMessage.text);
    expect(parsedResult4.success).toBeTruthy();
    expect(parsedResult4.message).toBe("Message successfully deleted");
  });
});

//// ---- GET REQUEST: Bad chatRoom var ---- ////
describe('GET: chatRoom _id: undefined', () => {
  const agent = request.agent(app);
  let cookie;
  it('Login & get cookie', async () => {
    const firstLogin = await agent
      .post('/login')
      .send({
        userName: 'ValidUser',
        password: 'fakePassword',
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const parsedResult1 = JSON.parse(firstLogin.text);
    expect(parsedResult1.success).toBeTruthy();
  });

  it('GET list of chatRooms', async () => {
    const getListOfChatRooms = await agent
      .get('/chatRoom')

      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult2 = JSON.parse(getListOfChatRooms.text);
    expect(parsedResult2.success).toBeTruthy();
    expect(parsedResult2.data).not.toBeUndefined();
  });

  it('GET bad message request, undefined /:_id parameter', async () => {
    const badChatRoomVar = await agent
      .get(`/message/${undefined}`)
      .expect('Content-Type', /json/)
      .expect(500);

    const parsedResult3 = JSON.parse(badChatRoomVar.text);
    expect(parsedResult3.success).toBeFalsy();
    expect(parsedResult3.message).not.toBeUndefined();
  });
});

//// ---- POST REQUESTS: Bad chatRoom var ---- ////
describe('POST: Bad chatRoom _id', () => {
  const agent = request.agent(app);
  let cookie;
  it('Login & get cookie', async () => {
    const firstLogin = await agent
      .post('/login')
      .send({
        userName: 'ValidUser',
        password: 'fakePassword',
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const parsedResult1 = JSON.parse(firstLogin.text);
    expect(parsedResult1.success).toBeTruthy();
  });

  it('GET list of chatRooms', async () => {
    const getListOfChatRooms = await agent
      .get('/chatRoom')
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult2 = JSON.parse(getListOfChatRooms.text);
    expect(parsedResult2.success).toBeTruthy();
    expect(parsedResult2.data).not.toBeUndefined();
  });

  it('POST message, malformed chatRoom._id', async () => {
    const createMessage = await agent
      .post('/message')
      .send({
        chatRoom: `${chats[0]._id}lskjdfoieur`,
        message: "This post was made OUTSIDE the test and inside the controller 😃"
      })

      .expect('Content-Type', /json/)
      .expect(500);

    const parsedResult3 = JSON.parse(createMessage.text);
    expect(parsedResult3.success).toBeFalsy();
    expect(parsedResult3.message).not.toBeUndefined();
  });
});

//// ---- PUT REQUESTS: no message _id ---- ////
describe('PUT: missing message value', () => {
  const agent = request.agent(app);
  let cookie;
  it('Login & get cookie', async () => {
    const firstLogin = await agent
      .post('/login')
      .send({
        userName: 'ValidUser',
        password: 'fakePassword',
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const parsedResult1 = JSON.parse(firstLogin.text);
    expect(parsedResult1.success).toBeTruthy();
  });

  it('GET list of chatRooms', async () => {
    const getListOfChatRooms = await agent
      .get('/chatRoom')
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult2 = JSON.parse(getListOfChatRooms.text);
    expect(parsedResult2.success).toBeTruthy();
    expect(parsedResult2.data).not.toBeUndefined();
  });

  it('GET list of messages from a chatRoom', async () => {
    const getLastFiftyMessages = await agent
      .get(`/message/${chats[0]._id}`)
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult3 = JSON.parse(getLastFiftyMessages.text);
    // let message = parsedResult3.data[0];
  });

  it('PUT message request, missing chatRoom._id', async () => {
    const editMessage = await agent
      .put('/message')
      .send({
        edit: "This post was made technically SAVED outside the test and inside the controller 😉",
      })
      .expect('Content-Type', /json/)
      .expect(500);

    const parsedResult4 = JSON.parse(editMessage.text);
    expect(parsedResult4.success).toBeFalsy();
    expect(parsedResult4.message).not.toBeUndefined();
  });
});

//// ---- DELETE REQUESTS: Malformed message _id ---- ////
describe('DELETE: malformed message _id', () => {
  const agent = request.agent(app);
  let cookie;
  let message;
  it('Login & get cookie', async () => {
    const firstLogin = await agent
      .post('/login')
      .send({
        userName: 'ValidUser',
        password: 'fakePassword',
      })
      .expect("Content-Type", /json/)
      .expect(200);

    const parsedResult1 = JSON.parse(firstLogin.text);
    expect(parsedResult1.success).toBeTruthy();
  });

  it('GET list of chatRooms', async () => {
    const getListOfChatRooms = await agent
      .get('/chatRoom')
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult2 = JSON.parse(getListOfChatRooms.text);
    expect(parsedResult2.success).toBeTruthy();
    expect(parsedResult2.data).not.toBeUndefined();
  });

  it('GET list of messages for a chatRoom', async () => {
    const getLastFiftyMessages = await agent
      .get(`/message/${chats[0]._id}`)
      .expect('Content-Type', /json/)
      .expect(200);

    const parsedResult3 = JSON.parse(getLastFiftyMessages.text);
    message = parsedResult3.data[0];
    message._id = 'woeirulskdjflskd';
  });

  it('DELETE message, malformed message._id', async () => {
    const deleteMessage = await agent
      .delete('/message')
      .send({
        message: message,
      })
      .expect('Content-Type', /json/)
      .expect(500);

    const parsedResult4 = JSON.parse(deleteMessage.text);
    expect(parsedResult4.success).toBeFalsy();
    expect(parsedResult4.message).not.toBeUndefined();
  });
});

//// ---- Testing Middleware Failues ---- ////
describe('I\'m not sure what this is for', () => {
  const agent = request.agent(app);
  it('GET message detail, unauthorized', async () => {
    const messageRequest = await agent
      .get('/message')
      .expect('Content-Type', /json/)
      .expect(401);

    const parsedResult = JSON.parse(messageRequest.text);
    expect(parsedResult.success).toBeFalsy();
    expect(parsedResult.data).toBeUndefined();
    expect(parsedResult.message).toMatch(/Unauthorized/);
  });

  it('GET list of messages, unauthorized', async () => {
    const messageRequest = await agent
      .get(`/message/${chats[0]._id}`)
      .expect('Content-Type', /json/)
      .expect(401);

    const parsedResult = JSON.parse(messageRequest.text);
    expect(parsedResult.success).toBeFalsy();
    expect(parsedResult.data).toBeUndefined();
    expect(parsedResult.message).toMatch(/Unauthorized/);
  });
})
