// db.js
require('dotenv').config();
const mongoose = require('mongoose');

let isConnected;

const connectToDatabase = async () => {
  if (isConnected) return mongoose;
  console.log('MONGO_URI:', process.env.MONGO_URI);
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = conn.connections[0].readyState;
    console.log('✅ MongoDB connected');
    return mongoose;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
};

// 👇 Disconnect helper for testing cleanup
const disconnectDatabase = async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB disconnected');
  isConnected = false;
};

module.exports = {
  connectToDatabase,
  disconnectDatabase,
};
