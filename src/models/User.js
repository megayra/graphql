import mongoose from "mongoose";
import Game from "./Game";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    games: {
        type: [Game.schema]
    },
    userType: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", UserSchema);

export default User;