console.log('\n\n-: App Started :-');

const express           = require('express');
const bodyParser        = require('body-parser');
const employeeRoutes    = require('./routes/api/employee');
const authRoutes        = require('./routes/api/auth');

const app   = express();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});




app.use(authRoutes);
app.use(employeeRoutes);


app.use('/', (req, res, next)=>{
    console.log('-: Welcome :-');
    res.send('-: Welcome :-');
    next();
});


console.log('-: App Running :-');
app.listen(3000);

