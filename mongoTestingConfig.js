const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function initializeMongoServer() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri);

  mongoose.connection.on('error', e => {
    if (e.message.code === 'ETIMEDOUT') {
      mongoose.connect(mongoUri);
    }
  });
};

module.exports = initializeMongoServer;
