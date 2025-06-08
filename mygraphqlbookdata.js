const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} = require('graphql');

// Dummy book data
const books = [
  { id: 1, title: 'GraphQL Basics' },
  { id: 2, title: 'Learning Express' },
  { id: 3, title: 'Advanced Node.js' },
];

// Define Book Type
const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'BookDetails',
  fields: () => ({
    id:     { type: GraphQLNonNull(GraphQLInt) },
    title:  { type: GraphQLNonNull(GraphQLString) }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    books: {
        type: GraphQLList(BookType),
        description: 'List of all books',
        resolve: () => books
    },
    book: {
        type: BookType,
        description: 'Get a book by ID',
        args: {
            id: { type: GraphQLInt }
        },
        resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    booksearch: {
        type: GraphQLList(BookType),
        description: 'List of all books',
        args: {
            title: { type: GraphQLString }  // argument for filtering
        },
        resolve: (parent, args) => {
            if (args.title) {
                return books.filter(book =>
                    book.title.toLowerCase().includes(args.title.toLowerCase())
                );
            }
            return books; // return all if no title filter
        }
    }      
  }
});

// Schema
const schema = new GraphQLSchema({ query: RootQuery });

// Express App
const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(3000, () => {
    console.clear()
    console.log('Server running at http://localhost:3000/graphql');
});
