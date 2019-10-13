const mongoose = require('mongoose');
const Joi = require('joi');

const userSchemaProperties = {
    name: { 
        type: String,
        required: true,
        minlength: 3,
        maxlength: 150
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 255
    },
    password: { 
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024
    },
    // role: {
    //     type: String,
    //     required: true,
    //     default: "Subscriber"
    // }
}

const userSchema = new mongoose.Schema(userSchemaProperties);

const User = mongoose.model( 'User', userSchema );


function validateUser(User) {

    // validation using joi dependancy
    const schema = {
        name: Joi.string().min(3).max(150).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(255).required(),
    }

    return Joi.validate(User, schema);

}

exports.User = User;
exports.validateUser = validateUser;
exports.userSchemaProperties = userSchemaProperties;
exports.userSchema = userSchema;