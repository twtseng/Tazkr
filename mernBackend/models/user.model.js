const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: [true,"First name is required"],
        minlength: [3,"First name must be at least 3 characters"],
    },
    lastName : {
        type: String,
        required: [true,"Last name is required"],
        minlength: [3,"Last name must be at least 3 characters"]
    },
    email : {
        type: String,
        required: [true,"Email is required"],
        minlength: [5,"Email must be at least 5 characters"]
    },
    description : {
        type: String,
        default: ""
    },
    passwordHash = {
        type: String,
        required: [true,"Password is required"],
        minlength: [8,"Password must be at least 8 characters"]
    },
    avatar = {
        type: String,
        default: "https://rpg-cify0074508w.netdna-ssl.com/wp-content/uploads/2020/02/service_default_avatar_182956.png"
    }
}, {timestamps : true});

module.exports.User = mongoose.model('User', UserSchema);