// app.js
const express = require('express');
const routes  = require('./routes');
const app     = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log('[Request] :::', req.method, req.url);
  next();
});

app.use('/', routes);

module.exports = app;
