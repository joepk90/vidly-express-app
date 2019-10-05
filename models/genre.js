const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model( 'Genre', new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
}) );

function validateGenre(genre) {

    // validation using joi dependancy
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(genre, schema);

}

exports.Genre = Genre;
exports.validateGenre = validateGenre;