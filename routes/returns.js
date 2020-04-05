const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const {Rental} = require('../models/rental');

// test endpoint is working
router.get('/', async (req, res) => {
    res.send('I am active!');
});

router.post('/', async (req, res) => {

    customerId = req.body.customerId;
    movieId = req.body.movieId;

    if (!customerId) res.status(400).send('no customerId provided');
    if (!movieId) res.status(400).send('no movieId provided');

    const rental = await Rental.findOne({ "customer._id": customerId, "movie._id": movieId });

    if (!rental) res.status(404).send('no rental found'); 

    res.send(401).send('unauthorized');

});

module.exports = router;