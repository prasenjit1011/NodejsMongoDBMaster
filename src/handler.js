// handler.js
const express     = require('express');
const serverless  = require('serverless-http');

const app = express();
app.use(express.json());


const students = require('./routes/studentcrud');
app.use('/mystudents', students);


module.exports.handler = async (event, context) => {
  return serverless(app)(event, context);
};
