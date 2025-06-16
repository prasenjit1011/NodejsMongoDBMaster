require('dotenv').config();
const express       = require('express');
const graphqlHTTP   = require('express-graphql').graphqlHTTP;
const mongoose      = require('./mongo');
const routes        = require('./routes');
const schema        = require('./modules/manager/manager.schema');
const managerRoutes = require('./modules/manager/manager.controller');


const app = express();
app.use(express.json());
app.use((req, res, next) => {
    console.log('[Request] ::: ', req.method, req.url);  // ← log what Express sees
    next();
});

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));
app.use('/manager', managerRoutes);
app.use('/', routes);

module.exports = app;
