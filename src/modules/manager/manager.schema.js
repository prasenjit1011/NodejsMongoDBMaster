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
      resolve: async () => Manager.find()
    },
    manager: {
      type: ManagerType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, { id }) => Manager.findById(id)
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addManager: {
      type: ManagerType,
      args: {
        name:  { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, args) => {
        const manager = new Manager(args);
        return await manager.save();
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
