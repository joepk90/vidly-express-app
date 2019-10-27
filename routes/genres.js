const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');

const { Genre, validateGenre } = require('../models/genre');



// return all genres
router.get('/', asyncMiddleware( async(req, res, next) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);

}));

// return genre by id
router.get('/:id', asyncMiddleware( async(req, res) => {

    const genre = await Genre.findById(req.param.id);

    // if genre id does not exist return 404
    if(!genre) {
        return res.status(404).send('The genre with the given ID was not found.')
    }

    // else return the genre data
    res.send(genre); 

}));

// example date params
// router.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.params);
// });

// example query
// router.get('/api/posts', (req, res) => {
//     res.send(req.query);
// });

// this can be tested in postman.
router.post('/', auth, asyncMiddleware( async(req, res) => {

    // basic validation example
    // if (!req.body.name || req.body.name.length < 3) {
    //     res.status(400 ).send('name is required and should be minimum 4 characters');
    //     return;
    // }

    // object destructoring
    const { error } = validateGenre(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // TODO make name unique (decapitilise new submission and existing data)
    const genre = new Genre({
        name: req.body.name
    });

    try {

        await genre.save();
        res.send(genre);

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }

    }

}));

// example PUT request
router.put('/:id', auth, asyncMiddleware( async(req, res) => {

    // object destructoring
    const { error } = validateGenre(req.body);
    if (error) {
        return res.status(400 ).send(error.details[0].message);
    }

    let genre = null;

    try {

        // update a document and return it
        genre = await Genre.findByIdAndUpdate( req.params.id, { name: req.body.name }, {
            new: true
        });

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
        
        // if genre id does not exist return 404
        return res.status(404).send('The genre with the given ID was not found.');

    }

    res.send(genre);

}));

// delete genre
router.delete('/:id', [auth, admin], asyncMiddleware( async(req, res) => {

    let genre = null;

    try {

        genre = await Genre.findByIdAndRemove(req.params.id);

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }

        // if genre id does not exist return 404
        return res.status(404).send('The genre with the given ID was not found.')

    }

    // return genre that has been deleted
    res.send(genre); 

}));

module.exports = router;