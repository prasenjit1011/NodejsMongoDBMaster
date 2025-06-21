// handler.js
const serverless = require('serverless-http');
const express = require('express');
const path    = require('path');
const app     = express();

app.use(express.json());
app.get('/', (req, res)=>{
  res.json({a:'hello 02'});
})

app.get('/productlist', (req, res)=>{
  res.json({a:'hello productlist 0033 '});
})


module.exports.handler = async (event, context) => {
  return serverless(app)(event, context);
};
