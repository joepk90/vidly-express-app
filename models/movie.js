const mongoose = require('mongoose');
const Joi = require('joi');

const { genreSchema } = require('./genre');

// console.log(Genre);

const Movie = mongoose.model( 'Movie', new mongoose.Schema({
    title: { 
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre:  {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    }
}) );

function validateMovie(movie) {

    // validation using joi dependancy
    const schema = {
        title: Joi.string().min(3).max(150).required(),

        // Joi validation intentionally differs from Mongoose Schema
        // The Post request requires an ID, wheares the schema should require the Genre Schema
        // The Genre object needs to be queried using the ID before the movie can be saved
        genreId: Joi.string().required(), 
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    }

    return Joi.validate(movie, schema);

}

exports.Movie = Movie;
exports.validateMovie = validateMovie;