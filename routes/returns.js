const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const moment = require('moment');
const Joi = require('joi');

const auth = require('../middleware/auth');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');

// test endpoint is working
router.get('/', async (req, res) => {
    res.send('I am active!');
});

router.post('/', auth, async (req, res) => {

    customerId = req.body.customerId;
    movieId = req.body.movieId;

    // object destructoring
    const { error } = validateReturn(req.body);
    if (error) return res.status(400 ).send(error.details[0].message);

    const rental = await Rental.findOne({ "customer._id": customerId, "movie._id": movieId });

    if (!rental) return res.status(404).send('no rental found'); 

    if(rental.dateReturned) return res.status(400).send('return date is set. movie already returned!');

    rental.dateReturned = new Date();

    const rentalDays = moment().diff(rental.dateOut, 'days');

    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate

    await rental.save();


    await Movie.update({ _id: rental.movie._id}, {
        $inc: {numberInStock: 1}
    })

    return res.status(200).send(rental);

});

function validateReturn(req) {

    // validation using joi dependancy
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    }

    return Joi.validate(req, schema);

}

module.exports = router;