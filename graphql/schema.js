const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type TestData{
        text: String!
        views: Int!
    }

    type RandNumber{
        views: Int!
    }

    type RootQuery{
        hello: TestData!
        randomNumber:RandNumber!
    }


    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
