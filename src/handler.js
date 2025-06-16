// handler.js
const serverless = require('serverless-http');
const app = require('./app');
const { connectToDatabase } = require('./mongo');

let isDbConnected = false;

const setup = async () => {
  if (!isDbConnected) {
    await connectToDatabase();
    isDbConnected = true;
  }
};

module.exports.handler = async (event, context) => {
  await setup();
  return serverless(app)(event, context);
};
