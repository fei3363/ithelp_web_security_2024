const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    hello: String
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    search(term: String!): [SearchResult!]!
    dangerousQuery(query: String!): JSON
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
  }

  union SearchResult = User | Post | Comment

  scalar JSON

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
    createPost(userId: ID!, title: String!, content: String!): Post!
    createComment(userId: ID!, postId: ID!, content: String!): Comment!
    deleteUser(id: ID!): Boolean!
    updateUser(id: ID!, username: String, email: String, password: String): User
    dangerousUpdate(collection: String!, id: ID!, updates: JSON!): JSON
  }
`;

module.exports = typeDefs;