//app.js
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./modules/manager/manager.schema');
const routes = require('./routes');

async function startServer() {
  const app = express();
  app.use(express.json());

  // Request logger
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  });

  // Apollo Server Setup
  const server = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV !== 'production',
    csrfPrevention: true,
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // REST routes
  app.use('/', routes);

  // 404 fallback
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack || err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  return app;
}

module.exports = startServer;
