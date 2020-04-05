const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

// test endpoint is working
router.get('/', async (req, res) => {
    res.send('I am active!');
});

router.post('/', async (req, res) => {

    if (!req.body.customerId) res.send(400).send('no customerId provided');
    if (!req.body.movieId) res.send(400).send('no movieId provided');

    res.send(401).send('unauthorized');

});

module.exports = router;