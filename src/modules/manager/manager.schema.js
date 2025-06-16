const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID } = require('graphql');
const Manager = require('./manager.model');

const ManagerType = new GraphQLObjectType({
  name: 'Manager',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) }
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    managers: {
      type: new GraphQLList(ManagerType),
      resolve: () => Manager.find(),
    },
  },
});

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
        const manager = new Manager(args);
        return manager.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
