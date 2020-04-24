import User from "../../models/User";
import { response } from "express";

export default {
    Query: {
        user: (root, args) => {
            return new Promise((resolve, reject) => {
                User.findOne(args).exec((error, response)=> {
                    error ? reject(error) : resolve(response);
                })
            })
        },
        users: () => {
            return new Promise((resolve, reject) => {
                User.find({}).populate().exec((error, response) => {
                    error ? reject(error) : resolve(response);
                })
            })
        }
    },
    Mutation: {
        addUser: (root, {username, firstname, lastname, email, password, phone}) => {
            const newUser = new User({username, firstname, lastname, email, password, phone});
            return new Promise((resolve, reject) => {
                newUser.save((error, response) => {
                    error ? reject(error) : resolve(response);
                })
            })
        },
        deleteUser: (root, {_id}) => {
            return new Promise((resolve, reject) => {
                User.findByIdAndRemove({_id}).exec((error, response) => {
                    error ? reject(error): resolve(response);
                })
            })
        },
        editUser: async (root, {_id, username, firstname, lastname, email, password, phone, games}) => {
            const response = await User.findByIdAndUpdate({_id}, {$set: {username, firstname, lastname, email, password, phone, games}}, {new: true}).exec();
            if(!response){
                throw new Error(`Cannot save user: ${_id}`);
            }
            return response;
        }
    }
}