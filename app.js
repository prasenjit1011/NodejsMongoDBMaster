console.log('\n\n-: Docker Nodejs App Started :-');

const express   = require('express');
const item      = require('./models/item');
const app       = express();

app.use('/', async (req, res, next)=>{
    const itemData = await item.findAll({raw:true});
    console.log(itemData);
    console.log('-: My Docker Nodejs App Running Successfully :-');
    res.send('-: My Docker Nodejs App Running Successfully :-====');
    next();
});

console.log('-: My Docker Nodejs App Running Successfully :-');
app.listen(3088);