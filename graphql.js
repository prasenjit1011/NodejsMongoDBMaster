const express           = require("express");
const { graphqlHTTP }   = require("express-graphql");
const { buildSchema }   = require("graphql");
const cors              = require("cors");
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
app.listen(4100, () => console.log("Server running at http://localhost:4000/graphql"));
