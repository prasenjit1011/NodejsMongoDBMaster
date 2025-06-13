const express = require('express');
const app = express();
const routes = require('./routes');

app.use((req, res, next) => {
    console.log('[Request] ::: ', req.method, req.url);  // ← log what Express sees
    next();
});

app.use(express.json());

const userCtrl = require('./modules/users/user.controller');
app.post('/users', userCtrl.create);
app.get('/users/:id', userCtrl.get);
app.put('/users/:id', userCtrl.update);
app.delete('/users/:id', userCtrl.remove);
app.get('/users', userCtrl.list);


app.use('/', routes);

module.exports = app;
