const express           = require("express");
const { graphqlHTTP }   = require("express-graphql");
const { buildSchema }   = require("graphql");
const cors              = require("cors");
const mongoose          = require('mongoose');
const session           = require('express-session');
const mongodbStore      = require('connect-mongodb-session')(session);


//const mongoConnect  = require('./util/database').mongoConnect;
const MONGODB_URI   = "mongodb+srv://tester:tester1234@cluster0.hlicuim.mongodb.net/Mydb?retryWrites=true&w=majority";
const store         = new mongodbStore({ uri: MONGODB_URI, collection: 'sessions' });
//const params        = { secret: 'my-secret', resave: false, saveUninitialized: false, store: store };

const graphqlSchema     = require('./graphql/schema');
const graphqlResolver   = require('./graphql/resolvers');

// // Define GraphQL Schema
// const schema = buildSchema(`
//   type Query {
//     hello: String
//     user(name: String!): String
//   }
// `);

// // Define Resolvers
// const root = {
//   hello: () => "Hello, World 888!",
//   user: ({ name }) => `Hello, ${name}!`,
// };

// Initialize Express Server
const app = express();
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema:graphqlSchema,
    rootValue: graphqlResolver, 
    graphiql: true, // Enables GraphiQL UI
  })
);

// Start Server
//app.listen(4100, () => console.log("Server running at http://localhost:4000/graphql"));
//mongoConnect(()=>app.listen(4100));
mongoose.connect(MONGODB_URI).then(result => app.listen(3002)).catch(err=>console.log(err));



/*

GraphQL URL : http://localhost:3002/graphql

Example 01 : Add User

mutation {
  createUser(userInput: {email: "test02@gmail.com", name: "maxiu Am", password: "test"}) {
    _id
    name
    email
    password
  }
}


Example 02 : Get Data
{
  randomNumber {
    views
  }
}
========== OR ============
query{
  randomNumber{views}
}


*/