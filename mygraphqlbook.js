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


// mutation { addBook(title: "New Book Title") { id, title }}
// { books { id, title }}
const books         = [{ id: 1, title: 'GraphQL Basics 123' }, { id: 2, title: 'Learning Express' }, { id: 3, title: 'Advanced Node.js' }];
const booksFields   = { 
    id: { type: GraphQLNonNull(GraphQLInt) }, 
    title: { type: GraphQLNonNull(GraphQLString) }
};
const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'BookDetails',
  fields: () => booksFields
});


const RootQuery   = new GraphQLObjectType({
  name: 'myQuery',
  fields: {
    books: {
        type: GraphQLList(BookType),
        description: 'BooksList',
        resolve: () => books
    }      
  }
});

const RootMutation  = new GraphQLObjectType({
  name: 'myMutation',
  fields: {
    addBook: {
      type: BookType, 
      description: 'Add a new book',
      args: {
        title: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const newBook = {
          id: books.length + 1,
          title: args.title
        };
        books.push(newBook);
        return newBook;
      }
    }
  }
});


const app    = express();
const schema = new GraphQLSchema({ query: RootQuery, mutation: RootMutation });
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));


app.listen(3000, () => {
    console.clear()
    console.log('GraphQL API running at http://localhost:3000/graphql');
});  