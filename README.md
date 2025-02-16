# NodeJS ExpressJS 

# Important command

npm init <br />
npm i --save express express-session body-parser ejs mongodb  <br />
npm i --save-dev nodemon <br />
nodemon app.js <br />


# Ejs Template Engine 

<%= %> <br />

## Docker & Redis :
#### Start Docker Desktop as Administrator 
```bash
## Check docker status : 
docker --version
docker pull redis:alpine
docker run -it -p 6379:6379 -d --name redis-server redis:alpine


## Install Redis within NodeJS Project :  
npm i redis

## express version : 4.17.1
## redis version : 3.0.2
## SET mykey "Hello Lnsel"
## GET mykey

## const redis = require('redis');
## const { promisify } = require('util');
## const redisClient = redis.createClient('6379', "127.0.0.1");
## redisClient.on('error', error => console.error(error));
## const redisSet = promisify(redisClient.set).bind(redisClient);
## const redisGet = promisify(redisClient.get).bind(redisClient);

## await redisSet('mykey04', 'Three N');
## let myval = await redisGet("mykey02");


```