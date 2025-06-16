const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} = require('graphql');

const Manager = require('./manager.model');

const ManagerType = new GraphQLObjectType({
  name: 'Manager',
  fields: () => ({
    id:     { type: GraphQLID },
    name:   { type: GraphQLString },
    email:  { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    managers: {
      type: new GraphQLList(ManagerType),
      description: 'Get all managers',
      resolve: async () => {
        try {
          return await Manager.find();
        } catch (err) {
          throw new Error('Failed to fetch managers');
        }
      }
    },
    manager: {
      type: ManagerType,
      description: 'Get a single manager by ID',
      args: { id: { type: GraphQLID } },
      resolve: async (_, { id }) => {
        try {
          return await Manager.findById(id);
        } catch (err) {
          throw new Error('Manager not found');
        }
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addManager: {
      type: ManagerType,
      description: 'Add a new manager',
      args: {
        name:  { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, args) => {
        try {
          const manager = new Manager(args);
          return await manager.save();
        } catch (err) {
          throw new Error('Error adding manager');
        }
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
