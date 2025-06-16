const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
} = require('graphql');

// Simulated in-memory DB
const managers = [
  { id: '1', name: 'John Manager', email: 'john@example.com' },
  { id: '2', name: 'Alice Manager', email: 'alice@example.com' },
];

// Manager Type
const ManagerType = new GraphQLObjectType({
  name: 'Manager',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // get single manager
    manager: {
      type: ManagerType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return managers.find((m) => m.id === args.id);
      },
    },
    // get all managers
    allManagers: {
      type: new GraphQLList(ManagerType),
      resolve() {
        return managers;
      },
    },
  },
});

// Mutation
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addManager: {
      type: ManagerType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        const newManager = {
          id: String(managers.length + 1),
          name: args.name,
          email: args.email,
        };
        managers.push(newManager);
        return newManager;
      },
    },
  },
});

// Export Schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
