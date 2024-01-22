# NodeJS master project with ExpressJS.

Using MongoDB with mongoose  <br />
Using SQL with Sequelize  <br />

## Important command list

npm init <br />
npm i --save express express-session body-parser ejs jsonwebtoken bcryptjs cookie-parser csurf csrf <br />
npm i --save mongodb mongoose connect-mongodb-session mysql2 sequelize <br />

npm i --save-dev nodemon <br />
nodemon app.js <br />


## Ejs Template Engine 

<%= %> <br />

## MongoDB and Mongoose setup and CRUD 

DB URL : 
https://cloud.mongodb.com/v2/65a000d7e3a5563410a0f43b#/metrics/replicaSet/65a0010b250b252ebbbd1382/explorer/Mydb/customers/find


## Middleware and CSRF

bodyParser    = require('body-parser') <br />
cookieParser  = require('cookie-parser'); <br />
csrf          = require('csurf') <br />
csrfProtect   = csrf();//{ cookie: true } <br />
app.use(csrfProtect); <br />


# Header setup for Cross server 

app.use((req, res, next) => { <br />
    res.setHeader('Access-Control-Allow-Origin', '*'); <br />
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); <br />
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); <br />
    next(); <br />
});<br />


## Javascript Promise with Example ( mypromise.js and app.js )
## Session-Cookie with MongoDB, Password Encryption, Authorization with JWT  (jsonwebtoken)

Create Pwd : bcryptjs.hash(pwd, 12) <br />
Compare Pwd : bcryptjs.compare(pwd, pwd1).then().catch() <br />

jwt				= require('jsonwebtoken'); <br />
token     		= jwt.sign(userdata, 'mysecret', { expiresIn: '1h' }); <br />

authorization	= req.get('Authorization'); <br />
token			= authorization.split(' ')[1]; <br />
data 			= jwt.verify(token, 'mysecret'); <br />


## Miscellaneous

Cron Job <br />



