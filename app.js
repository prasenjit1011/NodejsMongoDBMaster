console.log('\n\n-: Docker Nodejs App Started :-');

const express   = require('express');
const app       = express();

app.use('/', (req, res, next)=>{
    console.log('-: My Docker Nodejs App Running Successfully :-');
    res.send('-: My Docker Nodejs App Running Successfully :-');
    next();
});

console.log('-: My Docker Nodejs App Running Successfully :-');
app.listen(3080);