const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const {Rental} = require('../models/rental');

// test endpoint is working
router.get('/', async (req, res) => {
    res.send('I am active!');
});

router.post('/', auth, async (req, res) => {

    customerId = req.body.customerId;
    movieId = req.body.movieId;

    if (!customerId) return res.status(400).send('no customerId provided');
    if (!movieId) return res.status(400).send('no movieId provided');

    const rental = await Rental.findOne({ "customer._id": customerId, "movie._id": movieId });

    if (!rental) return res.status(404).send('no rental found'); 

    if(rental.dateReturned) return res.status(400).send('return date is set. movie already returned!');

    return res.status(200).send('rental found');

});

module.exports = router;