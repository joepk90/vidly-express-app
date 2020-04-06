const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

const { customerSchemaProperties } = require('./customer');
const { movieSchemaProperties } = require('./movie');

// console.log(movieSchema);

const rentalSchema = new mongoose.Schema({
    customer:  {
        type: new mongoose.Schema({
            name: customerSchemaProperties.name,
            isGold: customerSchemaProperties.isGold,
            phone: customerSchemaProperties.phone
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: movieSchemaProperties.title,
            dailyRentalRate: movieSchemaProperties.dailyRentalRate,
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookup = function(customerId, movieId) {

    return this.findOne({
        "customer._id": customerId,
        "movie._id": movieId
    });

}

rentalSchema.methods.return = function() {
 
    this.dateReturned = new Date();

    // TODO - this does not seem to be working... (on production)
    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate

}

const Rental = mongoose.model( 'Rental', rentalSchema );

function validateRental(rental) {

    // validation using joi dependancy
    const schema = { 
        movieId: Joi.objectId().required(), // only an objectId is required
        customerId: Joi.objectId().required(),  // only an objectId is required
    }

    return Joi.validate(rental, schema);

}

exports.rentalSchema = rentalSchema;
exports.Rental = Rental;
exports.validateRental = validateRental;