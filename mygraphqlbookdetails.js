const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');

// Sample data
const books = [
  { id: 1, title: "Book A", user_id: 1 },
  { id: 2, title: "Book B", user_id: 2 },
  { id: 3, title: "Book C", user_id: 1 },
];

const authors = [
  { id: 1, fname: "John", lname: "Doe", book_id: 1 },
  { id: 2, fname: "Jane", lname: "Smith", book_id: 2 },
];

// Book Type
const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'A book object',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    user_id: { type: GraphQLNonNull(GraphQLInt) },
  }),
});

// Author Type
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'An author object',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    fname: { type: GraphQLNonNull(GraphQLString) },
    lname: { type: GraphQLNonNull(GraphQLString) },
    book_id: { type: GraphQLNonNull(GraphQLInt) },
    book: {
      type: BookType,
      resolve: (author) => books.find(book => book.id === author.book_id)
    }
  }),
});

// Root Query
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: () => authors
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: () => books
    }
  }
});

// Schema
const schema = new GraphQLSchema({
  query: RootQueryType
});

// Express App
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(3000, () => {
    console.clear()
    console.log('GraphQL API running at http://localhost:3000/graphql');
});
