const express = require('express');
const app = express();
const routes = require('./routes');

app.use((req, res, next) => {
    console.log('[Request] ::: ', req.method, req.url);  // ← log what Express sees
    next();
});

app.use('/', routes);

module.exports = app;
