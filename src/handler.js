// handler.js
const express     = require('express');
const serverless  = require('serverless-http');

const app = express();
app.use(express.json());

const prodcrud = require('./routes/productcrud');
app.use('/products', prodcrud);

app.get('/', (req, res) => {
  res.json({ a: 'hello 02' });
});

module.exports.handler = async (event, context) => {
  return serverless(app)(event, context);
};
