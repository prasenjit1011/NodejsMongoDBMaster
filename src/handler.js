// handler.js
const serverlessExpress = require('@vendia/serverless-express');
const startServer = require('./app');
const { connectToDatabase } = require('./mongo');

let server; // Reuse across invocations

exports.handler = async (event, context) => {
  if (!server) {
    await connectToDatabase();
    const app = await startServer();
    server = serverlessExpress({ app });
  }
  return server(event, context);
};
