const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const UserModel = require('../models/users');
const ChatRoomModel = require('../models/chatrooms');
const MessageModel = require('../models/messages');
const bcrypt = require('bcryptjs');

(async () => {
  // Create mongodb memory server
  const mongoServer = await MongoMemoryServer.create();

  // Get and store the URI of the MongoMemoryServer
  const mongoUri = await mongoServer.getUri();

  // Connect mongose to said server
  mongoose.connect(mongoUri);

  // Create User
  bcrypt.hash('greenbottle', 12, async (err, hashedPassword) => {
    const billy = new UserModel({
      userName: 'billy',
      email: 'itisbilly@gmail.com',
      password: hashedPassword,
    });
    await billy.save();

    const newChatroom = new ChatRoomModel({
      owner: billy._id.toString(),
      participants: [{ _id: billy._id.toString(), userName: billy.userName }],
    });
    await newChatroom.save();

    const newMessage = new MessageModel({
      author: { _id: billy._id.toString(), userName: billy.userName },
      chatRoom: newChatroom._id.toString(),
      message: "First message!",
    });
    await newMessage.save();
  });
  bcrypt.hash('greenbottle', 12, async (err, hashedPassword) => {
    const silly = new UserModel({
      userName: 'silly',
      email: 'silly@site.com',
      password: hashedPassword,
    });
    await silly.save();
  });
})();
