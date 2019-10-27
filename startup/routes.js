const express = require('express');

const auth = require('../routes/auth');
const users = require('../routes/users');
const rentals = require('../routes/rentals');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const home = require('../routes/home');
const error = require('../middleware/error');

module.exports = function(app) {

    app.use(express.json());

    // routes
    app.use('/', home);
    app.use('/api/users', users);
    app.use('/api/rentals', rentals);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/auth', auth);
    
    // error handler - must be registered after the routes
    app.use(error);

}