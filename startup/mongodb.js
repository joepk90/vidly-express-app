
const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {

    mongoose.connect('mongodb://localhost/vidly')
    .then( () => winston.info('Connected to MongoDB...'))
    // to connect to mongoDB, make sure mongodb is running on localhost. run:
    // mongod

}