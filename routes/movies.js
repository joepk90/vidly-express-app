const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require("../middleware/validateObjectId");
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');


router.get('/', async (req, res) => {

    const movie = await Movie.find().sort('name');

    res.send(movie);
});


router.get('/:id', validateObjectId, async (req, res) => {

    const movie = await Movie.findById(req.params.id);

    // if movie id does not exist return 404
    if (!movie) {
        return res.status(404).send('The movie with the given ID was not found.')
    }

    // else return the movie data
    res.send(movie);

});

router.post('/', auth, async (req, res) => {

    // object destructoring
    const { error } = validateMovie(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId).select('name id'); // why not do this???
    // const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
        return res.status(400).send('Invalid genre');
    }

    const movie = new Movie({
        title: req.body.title,
        genre: genre, // why not do this???
        // genre: {
        //     _id: genre._id,
        //     name: genre.name
        // },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    try {

        await movie.save();
        res.send(movie);

    } catch (ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }

    }



});

router.put('/:id', auth, async (req, res) => {

    // object destructoring
    const { error } = validateMovie(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let movie = null;

    const genre = await Genre.findById(req.body.genreId).select('name id'); // why not do this???

    // const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
        return res.status(400).send('Invalid genre');
    }

    try {

        // update a document and return it
        movie = await Movie.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            genre: genre,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }, {
            new: true
        });

    } catch (ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }

        // if movie id does not exist return 404
        return res.status(404).send('The movie with the given ID was not found.');

    }

    res.send(movie);

});

router.delete('/:id', [auth, admin], async (req, res) => {

    let movie = null;

    try {

        // TODO not working - always returning a 200 error, even if movie does not exist
        movie = await Movie.findByIdAndRemove(req.params.id);

    } catch (ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }

        // if movie id does not exist return 404
        return res.status(404).send('The movie with the given ID was not found.')

    }

    if (movie === null) {
        // if movie id does not exist return 404
        return res.status(404).send('The movie with the given ID was not found.')
    }

    // return movie that has been deleted
    res.send(movie);

});

module.exports = router;