
const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {

    const db = config.get('db');

    mongoose.connect(db)
    .then( () => winston.info(`Connected to ${db}...`))
    // to connect to mongoDB, make sure mongodb is running on localhost. run:
    // mongod

}

