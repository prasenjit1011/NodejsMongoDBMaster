
console.log('\n\n-: App Started :-');

import express from 'express';
import todosRouter from './routes/todos';
import bodyParser from 'body-parser';

const app       = express();
app.use(bodyParser.json());
app.use(todosRouter)


console.log('-: App Running :-');
app.listen(3000);