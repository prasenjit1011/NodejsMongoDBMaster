require('dotenv').config();
const express = require('express');
const mongoose = require('./mongo');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./modules/manager/manager.schema');
const routes = require('./routes');
const managerRoutes = require('./modules/manager/manager.controller');

async function startServer() {
  const app = express();
  app.use(express.json());

  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  });

  const server = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV !== 'production',
    csrfPrevention: true
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.use('/manager', managerRoutes);
  app.use('/', routes);

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  return app;
}

module.exports = startServer;
