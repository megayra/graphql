import User from "../../models/User";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import validator from 'validator';
import ValidationError from '../ValidationError';
import dotenv from "dotenv";
dotenv.config();

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
        },
        currentUser: async (root, args, {user}) => {
            if(!user){
                throw new ValidationError([{
                    key: 'user',
                    message: 'user_not_authenticated',
                }])
            }
            return await User.findById(user._id);   
        }
    },
    Mutation: {
        addUser: async (root, {username, firstname, lastname, email, password, phone, userType}) => {

            let errors = [];
            if(validator.isEmpty(username)){
                errors.push({
                    key: 'username',
                    message: 'is_empty',
                })
            }

            if(validator.isEmpty(firstname)){
                errors.push({
                    key: 'firstname',
                    message: 'is_empty',
                })
            }

            if(validator.isEmpty(lastname)){
                errors.push({
                    key: 'lastname',
                    message: 'is_empty',
                })
            }

            if(!validator.isEmail(email)){
                errors.push({
                    key: 'email',
                    message: 'email_not_valid',
                })    
            }
            
            if(!validator.isLength(password, {min: 6, max: 20})){
                errors.push({
                    key: 'password',
                    message: 'password_length',
                })    
            }

            if(validator.isEmpty(phone)){
                errors.push({
                    key: 'phone',
                    message: 'is_empty',
                })
            }

            if(errors.length){
                throw new ValidationError(errors);
            }

            const newUser = await new User({
                username,
                firstname,
                lastname,
                email,
                password: await bcrypt.hash(password, 10),
                phone,
                userType
            });
            if(!newUser){
                throw new Error(`Cannot create user ${email}`)
            }
            let savedUser = null;
            try {
                savedUser = await newUser.save();        
            } catch (e) {
                console.log(e);
                 if(e.code === 11000){
                    throw new ValidationError([{
                        key: 'email',
                        message: 'email_in_use',
                    }]);
                 }
                 throw new Error(`Cannot create user ${email}`)
            }
            return jsonwebtoken.sign({
                    _id: newUser._id,
                    email: newUser.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1d'
            });
        },
        login: async(root, {email, password}) => {
            const user = await User.findOne({email});
            if(!user) {
                throw new Error(`Cannot find user: ${email}`);
            }

            const valid = await bcrypt.compare(password, user.password);

            if(!valid){
                throw new Error(`Password doesnt match the email: ${email}`)
            }

            return jsonwebtoken.sign(
                {
                    _id: user._id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1d'
                }
            )
        },
        deleteUser: (root, {_id}) => {
            return new Promise((resolve, reject) => {
                User.findByIdAndRemove({_id}).exec((error, response) => {
                    error ? reject(error): resolve(response);
                })
            })
        },
        editUser: async (root, {_id, username, firstname, lastname, email, password, phone, games}, {user}) => {
            if(!user) {
                throw new Error(`The user isnt authenticated!`);
            }

            const response = await User.findByIdAndUpdate({_id}, {$set: {username, firstname, lastname, email, password, phone, games}}, {new: true}).exec();
            if(!response) {
                throw new Error(`The user ${_id} cannot be saved!`);
            }
            return response;
        }
    }
}