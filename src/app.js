const express = require('express');
const app = express();
const routes = require('./routes');
const {connectToDatabase} = require('./mongo'); // ⬅️ import mongo connector

// Connect once on cold start (Lambda best practice)
connectToDatabase()
  .then(() => console.log('📡 DB Ready'))
  .catch((err) => console.error('❌ DB init error:', err));

app.use(express.json());
app.use((req, res, next) => {
    console.log('[Request] ::: ', req.method, req.url);  // ← log what Express sees
    next();
});





app.use('/', routes);

module.exports = app;
