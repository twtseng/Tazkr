const mongoose = require('mongoose');
const User = require('./user.model');
const Column = require('./user.model');

const TaskSchema = new mongoose.Schema({
    Name : {
        type: String,
        required: [true,"Task name is required"]
    },
    description: {
        type: String,
        required: [true,"Task description is required"]
    },
    priorityLevel: {
        type: Number,
        default: 0
    },
    assignedUser: {
        type: User
    },
    column: {
        type: Column
    },
    dueDate: {
        type: Date
    }
}, {timestamps : true});

module.exports.Task = mongoose.model('Task', TaskSchema);