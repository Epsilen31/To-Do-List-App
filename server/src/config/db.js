const mongoose = require('mongoose');
const { SERVER } = require('../constants');

async function connectDatabase(uri) {
  if (!uri) {
    throw new Error(
      'MONGODB_URI is missing. Set it in server/.env to your MongoDB Atlas connection string.'
    );
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: SERVER.MONGO_SERVER_SELECTION_TIMEOUT_MS,
  });

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

module.exports = { connectDatabase };
