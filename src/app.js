require('dotenv').config();

const express        = require('express');
const mongoose       = require('./mongo');
const { graphqlHTTP } = require('express-graphql');
const schema         = require('./modules/manager/manager.schema');
const routes         = require('./routes');
const managerRoutes  = require('./modules/manager/manager.controller');

const app = express();

// Global middlewares
app.use(express.json());

// Basic request logger
app.use((req, res, next) => {
  console.info(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Mount routes
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: process.env.NODE_ENV !== 'production' // disable GraphiQL in prod
}));

app.use('/manager', managerRoutes);
app.use('/', routes);

// Optional: 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Optional: Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
