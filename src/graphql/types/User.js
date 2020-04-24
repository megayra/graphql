export default `

    type User {
        _id: String!
        username: String!
        firstname: String!
        lastname: String!
        email: String!
        password: String!
        phone: String
        games: [Game]
    }

    type Query {
        user(_id: String!): User
        users: [User]
    }

    type Mutation {
        addUser(username: String!, firstname: String!, lastname: String!, email: String!, password: String!, phone: String): User
        deleteUser(_id: String!): User
        editUser(_id: String!, username: String, firstname: String, lastname: String, email: String, password: String, phone: String, games: [GameInput]): User
    }

`