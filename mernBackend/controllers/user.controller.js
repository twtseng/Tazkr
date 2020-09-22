const { User } = require('../models/user.model');

const handleResponse = (err,result,resp) => err ? resp.status(400).json(err) : resp.json(result);

module.exports = {
    createUser : async (req,resp) => {
        await User.create(req.body, (err,result) => handleResponse(err,result,resp));
    },
    getAllUsers : async (req,resp) => {
        await User.find({}, (err,result) => handleResponse(err,result,resp));
    },
    getSingleUser : async (req,resp) => {
        await User.findOne({_id:req.params.id}, (err,result) => handleResponse(err,result,resp));
    },
    updateUser : async (req,resp) => {
        await User.findOneAndUpdate({_id:req.params.id}, req.body, {new:true,runValidators:true}, (err,result) => handleResponse(err,result,resp));
    },
    deleteUser : async (req,resp) => {
        await User.findOneAndDelete({_id:req.params.id}, (err,result) => handleResponse(err,result,resp));
    }
}