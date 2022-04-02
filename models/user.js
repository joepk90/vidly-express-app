const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
const JoiPasswordComplexity = require('joi-password-complexity');
const { jwtPrivateKey } = require('./../utilities/environmentVars');

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
    isAdmin: {
        type: Boolean,
        default: false 
    }
    // role: {
    //     type: String,
    //     required: true,
    //     default: "Subscriber"
    // }
}

const userSchema = new mongoose.Schema(userSchemaProperties);

// extends the Mongoose schema and creates a new method within the user model
// usage: user.generateAuthKey();
// cannot use arrow functin here (() => {}) as {this} will reference the calling function when run, not the user object
userSchema.methods.generateAuthToken = function() {

    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            isAdmin: this.isAdmin
        },
        jwtPrivateKey
    );

}

const User = mongoose.model( 'User', userSchema );

function validateUser(User) {

    const complexityOptions = {
        min: 4,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 2,
      }

    // validation using joi dependancy
    const schema = {
        name: Joi.string().min(3).max(150).required(),
        email: Joi.string().min(3).max(255).required().email(),
        // password: Joi.string().min(3).max(255).required(),
        password: new JoiPasswordComplexity(complexityOptions).required(),
    }

    return Joi.validate(User, schema);

}

exports.User = User;
exports.validateUser = validateUser;
exports.userSchemaProperties = userSchemaProperties;
exports.userSchema = userSchema;