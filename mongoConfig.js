const mongoose = require('mongoose')
require('dotenv').config();

const mongoDb = process.env.MONGODB_KEY;

mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));
