console.clear();
console.log('\n\n-: App Started :-');

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema_submanager');

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.use('/', (req, res, next) => {
  console.log('-: Welcome :-');
  res.send('-: Welcome :-');
  next();
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Central Error Handler:', err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

console.log('-: App Running :-', (new Date).getMinutes()+'|'+(new Date).getSeconds()+'|'+(new Date).getMilliseconds());
app.listen(8040);
