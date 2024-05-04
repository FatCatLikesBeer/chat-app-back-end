const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

(async () => {
  // Create mongodb memory server
  const mongoServer = await MongoMemoryServer.create();

  // Get and store the URI of the MongoMemoryServer
  const mongoUri = await mongoServer.getUri();

  // Connect mongose to said server
  mongoose.connect(mongoUri);
})();
