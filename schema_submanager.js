const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLSchema
} = require('graphql');

// Sample in-memory data
const managers = [
  { id: '1', name: 'CEO', email: 'ceo@company.com', subManagerIds: ['2', '3'] },
  { id: '2', name: 'VP Eng', email: 'vpengg@company.com', subManagerIds: ['4'] },
  { id: '3', name: 'VP Marketing', email: 'vpmarketing@company.com', subManagerIds: ['7'] },
  { id: '4', name: 'Dummy Zero Manager', email: 'em@company.com', subManagerIds: ['5'] },
  { id: '5', name: 'Dummy One Manager', email: 'em@company.com', subManagerIds: ['6'] },
  { id: '6', name: 'Dummy Two Manager', email: 'em@company.com', subManagerIds: [] },
  { id: '7', name: 'Dummy Three Manager', email: 'em@company.com', subManagerIds: [] },
];

// Manager Type with Recursive subManagers
const ManagerType = new GraphQLObjectType({
  name: 'Manager',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    subManagers: {
      type: new GraphQLList(ManagerType),
      resolve(parent) {
        return managers.filter(m => parent.subManagerIds.includes(m.id));
      }
    }
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    manager: {
      type: ManagerType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return managers.find(m => m.id === args.id);
      }
    },
    allManagers: {
      type: new GraphQLList(ManagerType),
      resolve() {
        return managers;
      }
    }
  }
});

// Export Schema
module.exports = new GraphQLSchema({
  query: RootQuery
});
