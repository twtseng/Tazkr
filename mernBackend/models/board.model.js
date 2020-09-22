const mongoose = require('mongoose');
const Column = require('./column.model');
const User = require('./user.model');

const BoardSchema = new mongoose.Schema({
    Name : {
        type: String,
        required: [true,"Board name is required"],
        minlength: [3,"Board name must be at least 3 characters"],
    },
    columns : {
        type: [{
            type:Column
        }],
        //validate: [val => val.length <= 3,'Pets can have at most 3 skills']
    },
    users : {
        type: [{
            type:User
        }]
    },
    createdBy : {
        type:User
    },
    updatedBy : {
        type:User
    },
    archived : {
        type: Boolean,
        default: false
    }
}, {timestamps : true});

module.exports.Board = mongoose.model('Board', BoardSchema);

