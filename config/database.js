const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }
  const mongooseOptions = {
    autoIndex: true,
  };
  await mongoose.connect(mongoUri, mongooseOptions);
  return mongoose.connection;
}

module.exports = { connectDatabase };

