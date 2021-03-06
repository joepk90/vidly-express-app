const mongoose = require('mongoose');
// Fawn library uses ojlintaskcollections collection in mongodb to perform two phase commits
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

Fawn.init(mongoose);

router.get('/', async (req, res) => {

    const rental = await Rental.find().sort('-dateOut');

    res.send(rental);
});

router.post('/', auth, async (req, res) => {

    // object destructoring
    const { error } = validateRental(req.body);
    if (error) {
        return res.status(400 ).send(error.details[0].message);
    }

    const customer = await Customer.findById(req.body.customerId); 

    if (!customer) return res.status(400).send('Invalid customer ID');

    const movie = await Movie.findById(req.body.movieId);

    if (!movie) return res.status(400 ).send('Invalid movie ID Test');

    if (movie.numberInStock === 0) return res.status(400 ).send('Movie not available');

    // todo check Movie and Customer ID are valid
    // todo check that endDate value is greater than dateOut
    // todo add logic to calcualte price of rental?


    const rental = new Rental({
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        dateOut: req.body.dateOut,
        dateIn: req.body.dateIn
    });

    try {

        // fawn requires the actual name of the collection + is case sensitive
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', {_id: movie._id}, {
            $inc: {numberInStock: -1 }
        })
        // .remove() // other operations can alsobe performed if needed
        .run();

        res.send(rental);

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }

        res.status(500).send('could not update records');

    }

});

router.get('/:id', async (req, res) => {

    const rental = await Rental.findById(req.params.id);

    // if rental id does not exist return 404
    if(!rental) {
        return res.status(404).send('The rental with the given ID was not found.')
    }

    // else return the rental data
    res.send(rental); 

});

router.put('/:id', auth, async (req, res) => {

    // object destructoring
    const { error } = validateRental(req.body);
    if (error) {
        return res.status(400 ).send(error.details[0].message);
    }

    let rental = null;

    try {

        // update a document and return it
        rental = await Rental.findByIdAndUpdate( req.params.id, { 
            movie: req.body.movie,
            customer: req.body.customer,
            dateOut: req.body.dateOut,
            dateIn: req.body.dateIn
        }, {
            new: true
        });

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
        
        // if rental id does not exist return 404
        return res.status(404).send('The rental with the given ID was not found.');

    }

    res.send(rental);

});

router.delete('/:id', auth, async (req, res) => {

    let rental = null;

    try {

        rental = await Rental.findByIdAndRemove(req.params.id);

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }

        // if rental id does not exist return 404
        return res.status(404).send('The rental with the given ID was not found.')

    }

    // return rental that has been deleted
    res.send(rental); 

});

module.exports = router;