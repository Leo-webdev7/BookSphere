import { gql } from "graphql-tag";

const typeDefs = gql`
type Query {
    me: User
}

type Mutation {
    login(email: String!, password: String!): auth
    addUser(username: String!, email: String!, password: String!): auth
    saveBook(input: BookInput!): User
    removeBook(bookId: String!): User
}

type User {
    _id: iD
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Auth {
    token: String
    user: User
}

input BookInput {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
    `;

    export default typeDefs;