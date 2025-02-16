console.clear();
console.log('-: App Started :-');

const express   = require('express');
const redis = require('redis');
const { promisify } = require('util');

const app       = express();
app.use(express.json());
const redisClient = redis.createClient('6379', "127.0.0.1");
redisClient.on('error', error => console.error(error));
const redisSet = promisify(redisClient.set).bind(redisClient);
const redisGet = promisify(redisClient.get).bind(redisClient);


app.get('/redis/set', async (req, res) => {
    await redisSet('mykey04', 'Three N');
    res.send('-: Redis key value set successfully! :- ');
});

app.get('/redis/get', async (req, res) => {
    let myval = await redisGet("mykey02");
    console.log(myval);
    res.send('-: Redis mykey02 value  :- '+myval);
});

app.use('/', (req, res, next)=>{
    console.log('-: Welcome :-');
    res.send('-: Welcome :-');
    next();
});

console.log('-: App Running :-----------------------------------------------------------------------------------------', parseInt(100*Math.random()));
app.listen(3000);