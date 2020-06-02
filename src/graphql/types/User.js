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
        userType: String!
    }

    type Query {
        user(_id: String!): User
        users: [User]
        currentUser: User
    }

    type Mutation {
        addUser(username: String!, firstname: String!, lastname: String!, email: String!, password: String!, phone: String, userType: String!): String
        login(email: String!, password: String!): String
        deleteUser(_id: String!): User
        editUser(_id: String!, username: String, firstname: String, lastname: String, email: String, password: String, phone: String, games: [GameInput]): User
    }
    
`